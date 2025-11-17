import { Component } from "@angular/core";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { BannerComponent } from "./banner/banner.component";
import { LucideAngularModule, ArrowRight } from "lucide-angular";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'client-home',
  imports: [HeaderComponent, BannerComponent, LucideAngularModule, FooterComponent],
  styleUrl: 'home.component.css',
  templateUrl: 'home.component.html',
})

export class HomeComponent {
  public readonly ArrowRightIcon = ArrowRight;
}
