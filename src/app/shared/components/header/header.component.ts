import { Component, signal } from "@angular/core";
import { LucideAngularModule, House, Search, MapPin, ClipboardList, SquareMenu, CircleX, UserRoundPlus } from "lucide-angular";

@Component({
  selector: 'client-header',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: 'header.component.html'
})

export class HeaderComponent {

  // Icons

  public readonly HomeIcon = House;
  public readonly SearchIcon = Search;
  public readonly MapPinIcon = MapPin;
  public readonly ClipboardListIcon = ClipboardList;
  public readonly SquareMenuIcon = SquareMenu;
  public readonly CircleXIcon = CircleX;
  public readonly UserRoundPlusIcon = UserRoundPlus;

  // Signals

  public isOpen = signal(false);

  // Methods

  public toggleMenu() : void {
    this.isOpen.update(state => !state);
  }
}
