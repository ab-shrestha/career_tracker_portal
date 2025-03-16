
import React from "react";

export type TableItem = {
  id: string;
  value: string;
  isEditing?: boolean;
};

export type TagItem = {
  id: string;
  value: string;
};

export type StorySection = {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
  isEditing: boolean;
};
