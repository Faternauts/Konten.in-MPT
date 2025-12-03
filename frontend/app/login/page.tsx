"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, User, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "signup" | "signin">("role");
  const [selectedRole, setSelectedRole] = useState<"brand" | "user" | null>(
    null
  );
  const [isSignUp, setIsSignUp] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleRoleSelect = (role: "brand" | "user") => {
    setSelectedRole(role);
    setStep("signup");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fake validation - accept anything
    localStorage.setItem("hasVisitedLogin", "true");
    // Save user role
    if (selectedRole) {
      localStorage.setItem("userRole", selectedRole);
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 items-center justify-center p-12">
        <div className="text-center">
          <h1
            className="text-8xl font-bold text-white mb-6"
            style={{ fontFamily: "Gill Sans, sans-serif" }}
          >
            Konten.in
          </h1>
          <p className="text-2xl text-white/90 font-medium">
            Turn Customers Into Your Creative Team
          </p>
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1
              className="text-5xl font-bold gradient-text mb-4"
              style={{ fontFamily: "Gill Sans, sans-serif" }}
            >
              Konten.in
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose how you want to join
            </p>
          </div>

          {/* Step 1: Role Selection */}
          {step === "role" && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Brand Card */}
                <Card
                  className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2 hover:border-primary"
                  onClick={() => handleRoleSelect("brand")}
                >
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 mx-auto">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-center text-2xl">
                      Sign up as Brand
                    </CardTitle>
                    <CardDescription className="text-center">
                      Access powerful tools to engage with creative communities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Upload and manage your ads
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Launch creative challenges
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Track engagement analytics
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* User Card */}
                <Card
                  className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2 hover:border-primary"
                  onClick={() => handleRoleSelect("user")}
                >
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 mx-auto">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-center text-2xl">
                      Sign up as User
                    </CardTitle>
                    <CardDescription className="text-center">
                      Join the community and unleash your creativity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Remix ads with AI tools
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Participate in challenges
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Earn rewards and recognition
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Step 2: Sign Up / Sign In Form */}
          {step === "signup" && (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  {selectedRole === "brand" ? (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-center text-2xl">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </CardTitle>
                <CardDescription className="text-center">
                  {isSignUp
                    ? `Sign up as ${
                        selectedRole === "brand" ? "Brand" : "Creator"
                      }`
                    : "Sign in to your account"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {selectedRole === "brand" ? "Brand Name" : "Full Name"}
                      </Label>
                      <Input
                        id="name"
                        placeholder={
                          selectedRole === "brand"
                            ? "e.g., Nike"
                            : "e.g., John Doe"
                        }
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setStep("role");
                        setSelectedRole(null);
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                        setName("");
                      }}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 gradient-bg">
                      {isSignUp ? "Sign Up" : "Sign In"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-sm text-primary hover:underline"
                    >
                      {isSignUp
                        ? "Already have an account? Sign in"
                        : "Don't have an account? Sign up"}
                    </button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    This is a demo. Any credentials will work.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
