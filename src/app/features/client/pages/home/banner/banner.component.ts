import { Component } from "@angular/core";
import { LucideAngularModule, ArrowRight } from "lucide-angular";

@Component({
  selector: 'client-banner',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: 'banner.component.html'
})

export class BannerComponent {
  public readonly ArrowRightIcon = ArrowRight;
}
