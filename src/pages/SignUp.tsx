import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import AddressFields, { type AddressValue, validateAddress } from "@/components/AddressFields";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "", pickupOrDropoff: "" });
  const [address, setAddress] = useState<AddressValue>({ street_address: "", city: "", state: "", zip_code: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuthenticatedUser } = useAuth();
  const navigate = useNavigate();

  const goNext = () => {
    setError("");
    if (!form.email.trim()) { setError("Email is required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.firstName.trim() || !form.lastName.trim()) { setError("First and last name are required."); return; }
    if (!form.pickupOrDropoff) { setError("Please select pickup or dropoff."); return; }
    if (form.pickupOrDropoff === "Pickup") {
      const addrError = validateAddress(address, true);
      if (addrError) { setError(addrError); return; }
    }

    setIsSubmitting(true);
    try {
      const { data, error: insertError } = await supabase
        .from("user_account")
        .insert({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          password: form.password,
          street_address: form.pickupOrDropoff === "Pickup" ? address.street_address.trim() : null,
          city: form.pickupOrDropoff === "Pickup" ? address.city.trim() : null,
          state: form.pickupOrDropoff === "Pickup" ? address.state : null,
          zip_code: form.pickupOrDropoff === "Pickup" ? address.zip_code.trim() : null,
          pickup_or_dropoff: form.pickupOrDropoff || null,
        })
        .select("user_id, first_name, last_name, email, street_address, city, state, zip_code, pickup_or_dropoff, email_notifications, weekly_reminders")
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          throw new Error("An account with this email already exists.");
        }
        throw new Error(insertError.message);
      }

      if (!data) {
        throw new Error("No user returned from database.");
      }

      const user = {
        id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        street_address: data.street_address,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        pickup_or_dropoff: data.pickup_or_dropoff,
        email_notifications: data.email_notifications ?? true,
        weekly_reminders: data.weekly_reminders ?? true,
      };

      setAuthenticatedUser(user);
      navigate("/signup-complete", { state: { user } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-center mb-2">Sign Up for Compostly</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Step {step} of 2</p>

        {step === 1 ? (
          <div className="space-y-4">
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
            <div><Label htmlFor="confirm">Confirm Password</Label><Input id="confirm" type="password" required value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} /></div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="button" className="w-full" onClick={goNext}>Continue</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
              <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Label htmlFor="pickupOrDropoff">Service Type</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    Choose Pickup if you want us to come pick up your compost weekly, choose dropoff if you want to handle it yourself.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={form.pickupOrDropoff} onValueChange={value => setForm({...form, pickupOrDropoff: value})}>
                <SelectTrigger id="pickupOrDropoff">
                  <SelectValue placeholder="Select pickup or dropoff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pickup">Pickup</SelectItem>
                  <SelectItem value="Dropoff">Dropoff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.pickupOrDropoff === "Pickup" && (
              <div>
                <AddressFields value={address} onChange={setAddress} required idPrefix="signup" />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => { setError(""); setStep(1); }} disabled={isSubmitting}>Back</Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
