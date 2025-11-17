import { Component } from "@angular/core";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { BannerComponent } from "./banner/banner.component";
import { LucideAngularModule, ArrowRight } from "lucide-angular";

@Component({
  selector: 'client-home',
  imports: [HeaderComponent, BannerComponent, LucideAngularModule],
  styleUrl: 'home.component.css',
  templateUrl: 'home.component.html',
})

export class HomeComponent {
  public readonly ArrowRightIcon = ArrowRight;
}
