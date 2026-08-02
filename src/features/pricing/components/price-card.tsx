'use client';

import { useTransition } from "react";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createCheckoutAction } from "@/features/pricing/actions/create-checkout-action";

interface PricingCardProps {
  product: any;
  billingInterval: 'month' | 'year';
}

export function PricingCard({ product, billingInterval }: PricingCardProps) {
  const price = product.prices?.find((p: any) => p.interval === billingInterval);
  const hasNumericPrice = Boolean(price?.unit_amount);
  const isContactPlan = !hasNumericPrice;
  const isPopular = product.name === "Pro";

  const displayPrice = hasNumericPrice
    ? `$${(price!.unit_amount / 100).toFixed(0)}`
    : null;

  const priceLabel = billingInterval === "year" ? "/year" : "/month";

  const planFeatures: Record<string, string[]> = {
    Starter: [
      "100 prompts per month",
      "Access to the PromptMystic engine",
      "Optimized for Claude & GPT-4o",
      "Email support",
      "Basic prompt templates",
    ],
    Pro: [
      "Unlimited prompts",
      "Access to the PromptMystic engine",
      "Optimized for Claude & GPT-4o",
      "Priority email support",
      "Advanced prompt templates",
      "Prompt history & organization",
    ],
    Premium: [
      "Unlimited prompts",
      "Access to the PromptMystic engine",
      "Optimized for Claude & GPT-4o",
      "Priority email support",
      "Advanced prompt engineering tools",
      "Custom prompt packs",
      "Early access to new features",
    ],
  };

  const features = planFeatures[product.name] || [];

  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative flex h-full flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
      
      {isPopular && (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <Badge className="bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-500">
            Most Popular
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-2 text-xl font-semibold text-black">{product.name}</div>

      {/* Price */}
      <div className="mb-6 flex min-h-[4.5rem] flex-col justify-center">
        {isContactPlan ? (
          <>
            <span className="text-3xl font-bold tracking-tight text-black">Let&apos;s talk</span>
            <span className="mt-1 text-sm text-neutral-600">Custom pricing for your team</span>
          </>
        ) : (
          <div className="flex items-baseline">
            <span className="text-5xl font-bold tracking-tighter text-black">{displayPrice}</span>
            <span className="ml-1 text-lg text-neutral-500">{priceLabel}</span>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="flex flex-1 flex-col">
        <ul className="mb-8 flex-1 space-y-3 text-sm text-neutral-700">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Button sticks to bottom */}
        <div className="mt-auto">
          <Button
            disabled={isPending}
            className={`w-full text-base font-medium ${
              isPopular
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : isContactPlan
                ? "bg-neutral-900 text-white hover:bg-black"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
            onClick={() => {
              if (isContactPlan) {
                window.location.href = "mailto:patcfitzgerald@gmail.com?subject=Premium%20plan%20enquiry";
                return;
              }
              if (!price?.id) return;
            
              startTransition(() => {
                createCheckoutAction(price.id);   // ← Fixed: pass only the ID string
              });
            }}
          >
            {isContactPlan ? "Contact Us" : isPending ? "Redirecting..." : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
}