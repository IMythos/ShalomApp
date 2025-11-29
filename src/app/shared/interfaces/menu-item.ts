import { LucideIconData } from "lucide-angular";

export interface MenuItem {
  id: number,
  icon: LucideIconData
  label: string;
  component: any;
}
