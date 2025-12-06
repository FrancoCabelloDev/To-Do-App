'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  onCreateTag?: (name: string, color: string) => Promise<void>;
}

const PRESET_COLORS = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6B7280', // gray
];

export function TagSelector({ availableTags, selectedTagIds, onTagsChange, onCreateTag }: TagSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim() || !onCreateTag) return;
    
    await onCreateTag(newTagName.trim(), newTagColor);
    setNewTagName('');
    setNewTagColor(PRESET_COLORS[0]);
    setIsCreating(false);
  };

  const selectedTags = availableTags.filter(tag => selectedTagIds.includes(tag.id));

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      
      {/* Selected tags display */}
      <div className="flex flex-wrap gap-1.5">
        {selectedTags.map(tag => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="gap-1 pr-1"
            style={{ backgroundColor: tag.color + '20', borderColor: tag.color, color: tag.color }}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => toggleTag(tag.id)}
              className="ml-1 hover:bg-black/10 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {/* Add tag button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            {!isCreating ? (
              <div className="space-y-2">
                <div className="text-sm font-medium mb-2">Select tags</div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {availableTags.map(tag => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className="w-full flex items-center gap-2 p-2 rounded hover:bg-muted text-left"
                      >
                        <div
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-sm flex-1">{tag.name}</span>
                        {isSelected && (
                          <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {onCreateTag && (
                  <>
                    <div className="border-t pt-2 mt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setIsCreating(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create new tag
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm font-medium">Create new tag</div>
                <div className="space-y-2">
                  <Input
                    placeholder="Tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                  />
                  <div>
                    <Label className="text-xs">Color</Label>
                    <div className="flex gap-1.5 mt-1.5">
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewTagColor(color)}
                          className="h-7 w-7 rounded-full border-2 transition-all"
                          style={{
                            backgroundColor: color,
                            borderColor: newTagColor === color ? 'black' : 'transparent',
                            transform: newTagColor === color ? 'scale(1.1)' : 'scale(1)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setIsCreating(false);
                      setNewTagName('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1"
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim()}
                  >
                    Create
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
