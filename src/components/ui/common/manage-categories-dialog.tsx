"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash } from "lucide-react";
import {
  createCategoryAction,
  deleteCategoryAction,
  getUserCategoriesAction,
} from "@/app/actions/categories.actions";

type Category = {
  id: string;
  name: string;
};

export function ManageCategoriesDialog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    const result = await getUserCategoriesAction();
    if (result.categories) {
      setCategories(result.categories as Category[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("O nome da categoria não pode ser vazio.");
      return;
    }
    setIsSubmitting(true);
    const result = await createCategoryAction(newCategoryName);
    if (result.success) {
      toast.success("A categoria foi adicionada com sucesso.");
      setNewCategoryName("");
      await fetchCategories();
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleDeleteCategory = async (id: string) => {
    const result = await deleteCategoryAction(id);
    if (result.success) {
      toast.success("A categoria foi deletada com sucesso.");
      await fetchCategories();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-[var(--light-white)]">
          Gerenciar Categorias
        </DialogTitle>
        <DialogDescription>
          Adicione, edite ou remova suas categorias de apostas personalizadas.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4 flex gap-4">
        <Input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Ex: Tênis"
          className="rounded-[.8rem] border border-[var(--light-white)] px-3 py-5 text-[.9rem] text-[var(--light-white)] placeholder:text-[var(--light-white)]/30"
          disabled={isSubmitting}
        />
        <Button
          onClick={handleAddCategory}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-[.8rem] bg-[var(--light-white)] text-[var(--gray)] hover:bg-white/90"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" color="black" />
          ) : (
            <>
              <Plus size={16} /> Adicionar
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 max-h-60 space-y-2 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" color="black" />
          </div>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-[.8rem] bg-white/5 p-3"
            >
              <span className="text-sm font-medium text-[var(--light-white)]">
                {category.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteCategory(category.id)}
                className="cursor-pointer text-red-500 hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash size={16} />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-white/50">
            Nenhuma categoria personalizada.
          </p>
        )}
      </div>
    </>
  );
}
