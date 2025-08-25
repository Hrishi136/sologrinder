
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Sword, Brain, Zap, Heart } from "lucide-react";
import { useChallengesV2 } from "@/hooks/useChallengesV2";
import { useToast } from "./ui/use-toast";

type Category = "combat" | "intelligence" | "agility" | "vitality";
type Difficulty = "easy" | "medium" | "hard";

const categoryOptions: { label: string; value: Category; Icon: React.FC<any>; color: string }[] = [
  { label: "Combat Training", value: "combat", Icon: Sword, color: "text-blue-400" },
  { label: "Intelligence Gathering", value: "intelligence", Icon: Brain, color: "text-pink-400" },
  { label: "Agility Development", value: "agility", Icon: Zap, color: "text-yellow-300" },
  { label: "Vitality Enhancement", value: "vitality", Icon: Heart, color: "text-red-400" },
];

const difficultyOptions: { label: string; value: Difficulty; color: string; points: number }[] = [
  { label: "Easy", value: "easy", color: "bg-green-500 text-white", points: 15 },
  { label: "Medium", value: "medium", color: "bg-yellow-400 text-black", points: 35 },
  { label: "Hard", value: "hard", color: "bg-red-600 text-white", points: 75 },
];

export default function NewQuestModal({ triggerClass }: { triggerClass?: string }) {
  const [open, setOpen] = useState(false);
  const [questName, setQuestName] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createChallenge } = useChallengesV2();
  const { toast } = useToast();

  // Reset form when modal closes
  const handleClose = () => {
    setOpen(false);
    setQuestName("");
    setCategory(null);
    setDifficulty(null);
    setDescription("");
    setIsSubmitting(false);
  };

  // Handle quest creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questName || !category || !difficulty) return;

    setIsSubmitting(true);
    
    const categoryLabel = categoryOptions.find(opt => opt.value === category)?.label || category;
    const difficultyData = difficultyOptions.find(opt => opt.value === difficulty);
    
    const challenge = await createChallenge(questName, categoryLabel);

    if (challenge) {
      toast({
        title: "Quest Accepted!",
        description: `Your ${difficulty} ${categoryLabel.toLowerCase()} quest has been created.`,
      });
      handleClose();
    } else {
      toast({
        title: "Quest Creation Failed",
        description: "Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className={`glow-button font-orbitron text-base px-5 py-2 ${triggerClass ?? ""}`}
          style={{ boxShadow: "0 0 18px 3px #00d4ff77, 0 0 38px 6px #0080ff88" }}
        >
          + Accept New Quest
        </Button>
      </DialogTrigger>
      <DialogContent className="system-panel system-panel-glow bg-[#0a0a0a90] border-system-blue2 border-2 p-6 rounded-2xl shadow-blue-glow animate-fade-in font-orbitron">
        <form
          className="w-full flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <DialogHeader>
            <DialogTitle className="text-system-blue2 tracking-widest mb-2 text-xl flex items-center gap-2">
              Accept New Quest
              <span className="text-system-blue text-sm ml-2 font-thin">[System]</span>
            </DialogTitle>
          </DialogHeader>
          {/* Quest Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-system-blue2 mb-1" htmlFor="questName">
              Quest Objective
            </label>
            <Input
              id="questName"
              value={questName}
              onChange={e => setQuestName(e.target.value)}
              placeholder="Enter quest objective..."
              className="bg-black/60 border-system-blue2 text-white font-orbitron placeholder:text-gray-400"
              autoFocus
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <div className="text-sm font-semibold text-system-blue2 mb-1">Category</div>
            <div className="grid grid-cols-2 gap-3">
              {categoryOptions.map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setCategory(opt.value)}
                  className={`flex items-center gap-2 p-2 rounded-lg border-2 font-orbitron text-sm transition-all hover-scale
                    ${category === opt.value
                    ? "border-system-blue2 bg-system-blue2/20 shadow-blue-glow"
                    : "border-system-blue2 bg-black/30"
                    }
                  `}
                  style={{
                    boxShadow: category === opt.value ? "0 0 18px 4px #00d4ff88" : undefined,
                  }}
                >
                  <opt.Icon className={`w-5 h-5 ${opt.color}`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <div className="text-sm font-semibold text-system-blue2 mb-1">Difficulty</div>
            <div className="flex gap-4">
              {difficultyOptions.map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-sm ring-2 ring-offset-0
                    ${opt.color}
                    ${difficulty === opt.value ? "ring-system-blue scale-105 shadow-md" : "ring-transparent opacity-80"}
                  `}
                >
                  <span>
                    {opt.value === "easy" && "🟢"}
                    {opt.value === "medium" && "🟡"}
                    {opt.value === "hard" && "🔴"}
                  </span>{" "}
                  {opt.label} <span className="opacity-60 font-normal">({opt.points} pts)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quest Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-system-blue2 mb-1" htmlFor="questDescription">
              Description <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <Textarea
              id="questDescription"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your daily objective..."
              className="bg-black/60 border-system-blue2 text-white font-orbitron placeholder:text-gray-400"
              rows={3}
              maxLength={240}
            />
          </div>

          {/* Buttons */}
          <DialogFooter className="flex flex-row gap-3 items-center justify-end mt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="font-orbitron border-system-blue2"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="glow-button bg-system-blue2/90 hover:bg-system-blue2 text-white px-6 py-2 rounded-lg font-orbitron text-base transition active:scale-95"
              disabled={!questName || !category || !difficulty || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Accept Quest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
