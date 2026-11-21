"use client";

import { useRef, useState } from "react";
import { ImagePlusIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_MENU_IMAGES,
  MENU_CATEGORIES,
  emptyMenuItem,
  validateMenuItemInput,
  type MenuItemErrors,
  type MenuItemInput,
} from "@/lib/menu-items";
import { uploadImage } from "@/lib/upload";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type MenuItemFormProps = {
  initialValues?: MenuItemInput;
  submitLabel: string;
  resetOnSuccess?: boolean;
  onSubmit: (values: MenuItemInput) => Promise<void>;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function MenuItemForm({
  initialValues = emptyMenuItem,
  submitLabel,
  resetOnSuccess = false,
  onSubmit,
}: MenuItemFormProps) {
  const [values, setValues] = useState<MenuItemInput>(initialValues);
  const [errors, setErrors] = useState<MenuItemErrors>({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setField<K extends keyof MenuItemInput>(
    key: K,
    value: MenuItemInput[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    let files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const slots = MAX_MENU_IMAGES - values.images.length;
    if (files.length > slots) {
      toast.error(`You can add up to ${MAX_MENU_IMAGES} images.`);
      files = files.slice(0, Math.max(slots, 0));
    }

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is larger than 5 MB.`);
        continue;
      }
      try {
        uploaded.push(await uploadImage(file));
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Image upload failed. Please try again."
        );
      }
    }

    if (uploaded.length > 0) {
      setValues((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
    setUploading(false);
  }

  function removeImage(index: number) {
    setValues((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateMenuItemInput(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(values);
      if (resetOnSuccess) {
        setValues(emptyMenuItem);
        setErrors({});
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const busy = uploading || submitting;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <CardContent className="grid gap-5 pt-6">
          <div className="grid gap-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              value={values.itemName}
              onChange={(e) => setField("itemName", e.target.value)}
              placeholder="e.g. Margherita Classic"
              disabled={busy}
            />
            <FieldError message={errors.itemName} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={values.category}
                onValueChange={(value) => setField("category", value)}
                disabled={busy}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {MENU_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.category} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={values.price}
                onChange={(e) => setField("price", e.target.value)}
                placeholder="e.g. 12.99"
                disabled={busy}
              />
              <FieldError message={errors.price} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location (area / city)</Label>
            <Input
              id="location"
              value={values.location}
              onChange={(e) => setField("location", e.target.value)}
              placeholder="e.g. Gulshan, Dhaka"
              disabled={busy}
            />
            <FieldError message={errors.location} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Describe the ingredients, size and taste."
              disabled={busy}
            />
            <FieldError message={errors.description} />
          </div>

          <div className="grid gap-3">
            <Label>
              Item Images ({values.images.length}/{MAX_MENU_IMAGES})
            </Label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {values.images.map((url, index) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Menu item image ${index + 1}`}
                    className="size-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={busy}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 rounded-full bg-background/90 p-1 shadow hover:bg-background"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              ))}

              {values.images.length < MAX_MENU_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={busy}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground transition hover:bg-muted disabled:opacity-60"
                >
                  {uploading ? (
                    <LoaderCircleIcon className="size-6 animate-spin" />
                  ) : (
                    <ImagePlusIcon className="size-6" />
                  )}
                  {uploading ? "Uploading..." : "Add image"}
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
            <p className="text-sm text-muted-foreground">
              The first image is the main image. Each image can be up to 5 MB.
            </p>
            <FieldError message={errors.images} />
          </div>

          <div>
            <Button type="submit" disabled={busy}>
              {submitting && (
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
              )}
              {submitting ? "Saving..." : submitLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}