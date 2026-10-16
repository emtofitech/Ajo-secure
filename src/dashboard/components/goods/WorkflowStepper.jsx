import { Check } from "lucide-react";

/** The happy path, in order. */
const WORKFLOW_STEPS = [
  { key: "SAVING", label: "Saving", hint: "Contributions in progress" },
  { key: "TARGET_REACHED", label: "Target reached", hint: "Fully funded" },
  { key: "MEMBER_CONFIRMED", label: "Member confirmed", hint: "You confirmed the order" },
  { key: "VENDOR_NOTIFIED", label: "Vendor notified", hint: "Vendor alerted about the order" },
  { key: "VENDOR_ACCEPTED", label: "Vendor accepted", hint: "Vendor is preparing it" },
  { key: "FULFILLED", label: "Fulfilled", hint: "Marked as received" },
];

const BRANCH_STATES = {
  CANCELLED: { label: "Cancelled", tone: "text-red-300", ring: "border-red-400/50 bg-red-400/10" },
  REFUNDED: { label: "Refunded", tone: "text-amber-300", ring: "border-amber-400/50 bg-amber-400/10" },
};

const TONE = {
  done: "border-[#5AB0FF] bg-[#5AB0FF] text-[#020817]",
  current: "border-[#5AB0FF] bg-[#020817] text-[#5AB0FF] ring-2 ring-[#5AB0FF]/40",
  todo: "border-white/20 bg-[#020817] text-white/35",
};

/**
 * The goods workflow rail. `reached` is the ordered list of statuses the
 * target has actually been through, so the current step is the last one
 * seen; a cancelled target also shows the cancel / refund branch.
 */
export default function WorkflowStepper({ reached = [], status }) {
  const seen = new Set(reached);
  const onBranch = status === "CANCELLED" || status === "REFUNDED";
  const lastSeen = WORKFLOW_STEPS.reduce((last, step, i) => (seen.has(step.key) ? i : last), -1);

  return (
    <div>
      <ol className="flex flex-col md:flex-row">
        {WORKFLOW_STEPS.map((step, i) => {
          const done = seen.has(step.key);
          const current = !onBranch && i === lastSeen && status !== "FULFILLED";
          const isLast = i === WORKFLOW_STEPS.length - 1;
          const nextDone = seen.has(WORKFLOW_STEPS[i + 1]?.key);
          const tone = done ? TONE.done : current ? TONE.current : TONE.todo;

          return (
            <li key={step.key} className="relative flex flex-1 gap-3 md:block">
              {/* connector: vertical below the dot on mobile, horizontal on md+ */}
              {!isLast ? (
                <span
                  aria-hidden
                  className={`absolute bottom-0 left-[13px] top-[30px] w-px md:bottom-auto md:left-0 md:right-0 md:top-[13px] md:h-px md:w-auto ${
                    nextDone ? "bg-[#5AB0FF]" : "bg-white/10"
                  }`}
                />
              ) : null}

              <span
                className={`relative z-10 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-2 font-manrope text-[11px] font-bold ${tone}`}
              >
                {done ? <Check size={13} strokeWidth={3} /> : i + 1}
              </span>

              <div className="pb-6 md:pt-3 md:pb-0">
                <p
                  className={`font-manrope text-[12.5px] font-semibold leading-tight ${
                    done ? "text-white" : current ? "text-[#5AB0FF]" : "text-white/40"
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`mt-0.5 font-manrope text-[11px] leading-tight ${
                    done || current ? "text-white/45" : "text-white/25"
                  }`}
                >
                  {current ? "Current step — " : ""}
                  {step.hint}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Cancel / refund branch */}
      {onBranch ? (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          {["CANCELLED", "REFUNDED"]
            .filter((s) => seen.has(s) || status === s)
            .map((s) => (
              <span
                key={s}
                className={`inline-flex items-center rounded-full border px-2.5 py-1 font-manrope text-[11px] font-semibold ${BRANCH_STATES[s].tone} ${BRANCH_STATES[s].ring}`}
              >
                {BRANCH_STATES[s].label}
              </span>
            ))}
        </div>
      ) : null}
    </div>
  );
}
