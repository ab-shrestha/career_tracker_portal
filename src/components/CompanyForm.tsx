import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Company } from "@/types/Company";
import { CompanyFormFields } from "./company/CompanyFormFields";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  affinity: z.enum(["Y", "N"]),
  motivation: z.string(),
  posting: z.string(),
  strengths: z.string(),
  values: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface CompanyFormProps {
  onSubmit: (data: Omit<Company, "id" | "score">) => void;
  onUpdate?: (data: Company) => void;
  editingCompany?: Company | null;
  onCancel?: () => void;
}

export default function CompanyForm({ onSubmit, onUpdate, editingCompany, onCancel }: CompanyFormProps) {
  const defaultValues: FormValues = {
    name: "",
    affinity: "N",
    motivation: "0",
    posting: "0",
    strengths: "0",
    values: "0",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: editingCompany ? {
      name: editingCompany.name,
      affinity: editingCompany.affinity,
      motivation: editingCompany.motivation.toString(),
      posting: editingCompany.posting.toString(),
      strengths: editingCompany.strengths.toString(),
      values: editingCompany.values.toString(),
    } : defaultValues,
  });

  // Reset form when editingCompany changes
  useEffect(() => {
    if (editingCompany) {
      form.reset({
        name: editingCompany.name,
        affinity: editingCompany.affinity,
        motivation: editingCompany.motivation.toString(),
        posting: editingCompany.posting.toString(),
        strengths: editingCompany.strengths.toString(),
        values: editingCompany.values.toString(),
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editingCompany, form]);

  const handleSubmit = (values: FormValues) => {
    try {
      // Convert string values to numbers for numeric fields
      const companyData: Omit<Company, "id" | "score"> = {
        name: values.name,
        affinity: values.affinity,
        motivation: Number(values.motivation),
        posting: Number(values.posting),
        strengths: Number(values.strengths),
        values: Number(values.values),
      };
      
      if (editingCompany && onUpdate) {
        onUpdate({
          ...editingCompany,
          ...companyData,
          score: 0, // This will be recalculated in the parent component
        });
      } else {
        onSubmit(companyData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <CompanyFormFields form={form} />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {editingCompany ? "Update" : "Add"} Company
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
