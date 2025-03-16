import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/form/SelectField";
import { UseFormReturn } from "react-hook-form";

interface CompanyFormFieldsProps {
  form: UseFormReturn<any>;
}

export function CompanyFormFields({ form }: CompanyFormFieldsProps) {
  const affinityOptions = [
    { value: "N", label: "No connection" },
    { value: "Y", label: "I know someone here" }
  ];

  const motivationOptions = [
    { value: "0", label: "Never heard of them" },
    { value: "1", label: "Don't want to work here" },
    { value: "2", label: "Would work here" },
    { value: "3", label: "Love to work here" },
    { value: "4", label: "Dream job" }
  ];

  const postingOptions = [
    { value: "0", label: "No positions open" },
    { value: "1", label: "Posting for related job" },
    { value: "2", label: "Desired job posting" }
  ];

  const alignmentOptions = [
    { value: "0", label: "Bad alignment" },
    { value: "1", label: "No alignment" },
    { value: "2", label: "Some alignment" },
    { value: "3", label: "Good alignment" },
    { value: "4", label: "Great alignment" }
  ];

  return (
    <div className="grid grid-rows-3 gap-4">
      {/* First row */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SelectField 
          form={form} 
          name="affinity" 
          label="Affinity" 
          options={affinityOptions}
          placeholder="Select affinity"
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 gap-4">
        <SelectField 
          form={form} 
          name="motivation" 
          label="Motivation" 
          options={motivationOptions}
          placeholder="Select motivation"
        />

        <SelectField 
          form={form} 
          name="posting" 
          label="Posting" 
          options={postingOptions}
          placeholder="Select posting status"
        />
      </div>

      {/* Third row */}
      <div className="grid grid-cols-2 gap-4">
        <SelectField 
          form={form} 
          name="strengths" 
          label="Strengths Alignment" 
          options={alignmentOptions}
          placeholder="Select strengths alignment"
        />

        <SelectField 
          form={form} 
          name="values" 
          label="Values Alignment" 
          options={alignmentOptions}
          placeholder="Select values alignment"
        />
      </div>
    </div>
  );
}
