import React, { useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ChevronRight, ChevronLeft, Printer, UserCheck } from 'lucide-react';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCondition?: string;
}

interface FormState {
  step: number;
  age: string;
  sex: string;
  country: string;
  travelDistance: string;
  condition: string;
  diagnosisYear: string;
  currentMeds: string;
  hasPriorSurgery: boolean;
}

type Action =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FIELD'; field: keyof FormState; value: any }
  | { type: 'RESET' };

const initialFormState: FormState = {
  step: 1,
  age: '42',
  sex: 'Female',
  country: 'United States',
  travelDistance: 'Within 50 miles',
  condition: 'Refractory Epilepsy',
  diagnosisYear: '2021',
  currentMeds: 'Levetiracetam, Lamotrigine',
  hasPriorSurgery: false,
};

function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 5) };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) };
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialFormState;
    default:
      return state;
  }
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  isOpen,
  onClose,
  initialCondition,
}) => {
  const [state, dispatch] = useReducer(formReducer, {
    ...initialFormState,
    condition: initialCondition || initialFormState.condition,
  });

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ED248F]/10 flex items-center justify-center text-[#ED248F]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0B132B]">
                  Trial Eligibility Screener
                </h3>
                <p className="text-[11px] font-medium text-slate-500 font-mono">
                  Step {state.step} of 5 • Confidential Intake
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-[#ED248F] to-[#06B6D4] transition-all duration-300"
              style={{ width: `${(state.step / 5) * 100}%` }}
            />
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {state.step === 1 && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-[#0B132B]">Demographics & Profile</h4>
                <p className="text-xs text-slate-600">
                  Basic patient details used to match protocol age and gender criteria.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={state.age}
                      onChange={(e) =>
                        dispatch({ type: 'UPDATE_FIELD', field: 'age', value: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ED248F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sex Assigned at Birth</label>
                    <select
                      value={state.sex}
                      onChange={(e) =>
                        dispatch({ type: 'UPDATE_FIELD', field: 'sex', value: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ED248F]"
                    >
                      <option>Female</option>
                      <option>Male</option>
                      <option>Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {state.step === 2 && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-[#0B132B]">Location & Travel Preferences</h4>
                <p className="text-xs text-slate-600">
                  Clinical trial sites near your home or virtual telemedicine options.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <select
                    value={state.country}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_FIELD', field: 'country', value: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ED248F]"
                  >
                    <option>United States</option>
                    <option>United Arab Emirates</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Maximum Travel Distance</label>
                  <select
                    value={state.travelDistance}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'travelDistance',
                        value: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ED248F]"
                  >
                    <option>Within 25 miles</option>
                    <option>Within 50 miles</option>
                    <option>Within 100 miles</option>
                    <option>Willing to travel nationally / flights covered</option>
                  </select>
                </div>
              </div>
            )}

            {state.step === 3 && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-[#0B132B]">Diagnosis & History</h4>
                <p className="text-xs text-slate-600">
                  Confirming disease stage and time since initial medical diagnosis.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Condition</label>
                  <input
                    type="text"
                    value={state.condition}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_FIELD', field: 'condition', value: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ED248F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Year Diagnosed</label>
                  <input
                    type="number"
                    value={state.diagnosisYear}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'diagnosisYear',
                        value: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ED248F]"
                  />
                </div>
              </div>
            )}

            {state.step === 4 && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-[#0B132B]">Current Treatments</h4>
                <p className="text-xs text-slate-600">
                  Medications or surgical interventions you have tried so far.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Prescription Medications</label>
                  <input
                    type="text"
                    value={state.currentMeds}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'currentMeds',
                        value: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ED248F]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="priorSurgery"
                    checked={state.hasPriorSurgery}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'hasPriorSurgery',
                        value: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-[#ED248F]"
                  />
                  <label htmlFor="priorSurgery" className="text-xs font-medium text-slate-700">
                    I have undergone surgical procedures related to this condition
                  </label>
                </div>
              </div>
            )}

            {state.step === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <UserCheck className="w-5 h-5" />
                    <h4 className="font-bold text-lg text-[#0B132B]">Confidential Match Intake Card</h4>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Intake
                  </button>
                </div>

                {/* Printable Intake Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Intake Reference:</span>
                    <span className="font-bold text-[#0B132B]">HKM-MATCH-2026-X9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Age / Sex:</span>
                    <span>{state.age} yrs / {state.sex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span>{state.country} ({state.travelDistance})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Condition:</span>
                    <span className="text-[#ED248F] font-bold">{state.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Diagnosed:</span>
                    <span>{state.diagnosisYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Therapy:</span>
                    <span>{state.currentMeds}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 italic">
                    ✓ Matches 3 active Phase II/III clinical trials with 95%+ probability. A HEKMA coordinator will review this submission within 24 hours.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            {state.step > 1 ? (
              <button
                onClick={() => dispatch({ type: 'PREV_STEP' })}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {state.step < 5 ? (
              <button
                onClick={() => dispatch({ type: 'NEXT_STEP' })}
                className="px-5 py-2 rounded-xl bg-[#0B132B] hover:bg-[#ED248F] text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#ED248F] to-[#7948A5] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Complete Intake
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
