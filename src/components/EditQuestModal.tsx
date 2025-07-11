import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tables } from '@/integrations/supabase/types';

interface EditQuestModalProps {
  open: boolean;
  onClose: () => void;
  quest: Tables<'Challenges'> | null;
  onSave: (updates: Partial<Tables<'Challenges'>>) => Promise<void>;
}

const CATEGORIES = [
  'Combat Training',
  'Intelligence Gathering', 
  'Agility Development',
  'Vital Enhancement',
  'Special Quests'
];

const DIFFICULTIES = [
  { value: 'easy', label: 'E-Rank (Easy)', points: 10 },
  { value: 'medium', label: 'D-Rank (Medium)', points: 20 },
  { value: 'hard', label: 'C-Rank (Hard)', points: 30 }
];

export default function EditQuestModal({ open, onClose, quest, onSave }: EditQuestModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Combat Training',
    difficulty: 'easy',
    points: 10
  });

  React.useEffect(() => {
    if (quest && open) {
      let category = 'Combat Training';
      let difficulty = 'easy';
      let points = 10;
      
      try {
        const steps = JSON.parse(quest.steps || '{}');
        category = steps.category || 'Combat Training';
        difficulty = steps.difficulty || 'easy';
        points = steps.points || 10;
      } catch (e) {
        // Use defaults
      }

      setFormData({
        title: quest.title || '',
        description: quest.description || '',
        category,
        difficulty,
        points
      });
    }
  }, [quest, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quest) return;

    setLoading(true);
    try {
      const steps = JSON.stringify({
        category: formData.category,
        difficulty: formData.difficulty,
        points: formData.points
      });

      await onSave({
        title: formData.title,
        description: formData.description,
        steps
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating quest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultyChange = (value: string) => {
    const selectedDifficulty = DIFFICULTIES.find(d => d.value === value);
    setFormData(prev => ({
      ...prev,
      difficulty: value,
      points: selectedDifficulty?.points || 10
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-system-panel border-2 border-system-blue2 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-system-blue font-orbitron text-xl">
            Edit Quest
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-system-blue2 font-orbitron">
              Quest Name
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-system-bg/50 border-system-blue2 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-system-blue2 font-orbitron">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-system-bg/50 border-system-blue2 text-white"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-system-blue2 font-orbitron">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="bg-system-bg/50 border-system-blue2 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-system-panel border-system-blue2">
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category} className="text-white">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty" className="text-system-blue2 font-orbitron">
              Difficulty
            </Label>
            <Select value={formData.difficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="bg-system-bg/50 border-system-blue2 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-system-panel border-system-blue2">
                {DIFFICULTIES.map(diff => (
                  <SelectItem key={diff.value} value={diff.value} className="text-white">
                    {diff.label} ({diff.points} points)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-system-blue2 text-system-blue2 hover:bg-system-blue2/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="glow-button"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}