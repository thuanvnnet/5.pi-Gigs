"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2 } from "lucide-react";
import { createCategoryAction, deleteCategoryAction } from "./actions";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

const initialState = { message: "", success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-10">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Category"}
    </Button>
  );
}

function CreateCategoryForm() {
  const [state, formAction] = useActionState(createCategoryAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        formRef.current?.reset();
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={formAction} ref={formRef} className="flex flex-col sm:flex-row items-end gap-4 p-6 bg-white rounded-xl border shadow-sm w-full">
      <div className="flex-1 w-full">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <Input id="name" name="name" placeholder="e.g., Graphics & Design" required className="h-10" />
      </div>
      <SubmitButton />
    </form>
  );
}

function DeleteCategoryButton({ category }: { category: Category }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        startTransition(async () => {
            const result = await deleteCategoryAction(category._id, category.slug);
            if (result.success) {
                toast.success("Category deleted.");
            } else {
                toast.error(result.error || "Failed to delete category.");
            }
        });
    };

    return (
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isPending} className="text-gray-400 hover:text-red-600 hover:bg-red-50">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    );
}

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  return (
    <div className="space-y-6">
      <CreateCategoryForm />
      <div className="bg-white rounded-xl border shadow-sm">
        <ul className="divide-y divide-gray-200">
          {initialCategories.length > 0 ? initialCategories.map((cat) => (
            <li key={cat._id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold text-gray-900">{cat.name}</p>
                <p className="text-sm text-gray-500 font-mono">{cat.slug}</p>
              </div>
              <DeleteCategoryButton category={cat} />
            </li>
          )) : (
            <p className="text-center py-12 text-gray-500 italic">No categories found. Add one to get started.</p>
          )}
        </ul>
      </div>
    </div>
  );
}