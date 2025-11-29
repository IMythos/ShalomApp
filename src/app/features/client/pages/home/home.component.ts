import { Component } from "@angular/core";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { BannerComponent } from "./banner/banner.component";
import { LucideAngularModule, ArrowRight } from "lucide-angular";
import { FooterComponent } from "./footer/footer.component";
import { AuthModalComponent } from "../../../../shared/components/auth-modal/auth-modal.component";

@Component({
  selector: 'client-home',
  imports: [HeaderComponent, BannerComponent, LucideAngularModule, FooterComponent, AuthModalComponent],
  styleUrl: 'home.component.css',
  templateUrl: 'home.component.html',
})

export class HomeComponent {
  public readonly ArrowRightIcon = ArrowRight;
}
