"use client";

import { cn } from "@/lib/utils";
import { OTPInput, SlotProps } from "input-otp";
import { useId } from "react";

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  tabIndex?: number;
}

export function PinInput({ value, onChange, error, tabIndex = 0 }: PinInputProps) {
  const id = useId();

  return (
    <OTPInput
      id={id}
      value={value}
      onChange={onChange}
      containerClassName="flex items-center has-[:disabled]:opacity-50"
      maxLength={4}
      render={({ slots }) => (
        <div className="flex">
          {slots.map((slot, idx) => (
            <Slot 
              key={idx} 
              {...slot} 
              error={error} 
              isFirst={idx === 0} 
              isLast={idx === slots.length - 1} 
              tabIndex={tabIndex}
            />
          ))}
        </div>
      )}
    />
  );
}

function Slot(props: SlotProps & { error?: boolean; isFirst?: boolean; isLast?: boolean; tabIndex?: number }) {
  return (
    <div
      className={cn(
        "relative -ml-px flex h-12 w-[3.25rem] items-center justify-center border bg-[#333333] text-white transition-colors",
        props.isFirst && "ml-0 rounded-l-lg",
        props.isLast && "rounded-r-lg",
        props.isActive && !props.error && "z-10 border-white",
        !props.isActive && "hover:border-gray-500",
        props.error ? "border-red-500" : "border-gray-600"
      )}
    >
      <input
        {...props}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        tabIndex={props.tabIndex}
      />
      <div className="pointer-events-none">
        {props.char !== null && <div>{props.char}</div>}
      </div>
    </div>
  );
}