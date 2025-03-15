import {
  ChangeDetectorRef,
  Component,
  OnInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { product } from '../data.types';
import { UserService } from '../services/user.service';
import { CartService } from '../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName: string = '';
  userName: string = '';
  searchTerm: string = '';
  searchResult: product[] = [];
  cartItems$: Observable<product[]> = new Observable();
  navbarCollapse: HTMLElement | null = null;

  constructor(
    private route: Router,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object // Injetando o identificador da plataforma
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.navbarCollapse = document.getElementById('navbarNav');
      this.cartItems$ = this.cartService.cartItems$;
      this.route.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.toggleMenu(false);
          this.updateMenuType(event.url);
          this.checkLoginStatus();
        }
      });
      this.checkLoginStatus();
    }
  }

  toggleMenu(state: boolean): void {
    if (this.navbarCollapse) {
      this.navbarCollapse.classList.toggle('show', state);
    }
  }

  onMenuClick() {
    if (this.navbarCollapse) {
      this.navbarCollapse.classList.toggle('show');
    }
  }

  closeMenuAfterNavigation() {
    if (this.navbarCollapse) {
      this.navbarCollapse.classList.remove('show');
    }
  }

  checkLoginStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      const sellerStore = localStorage.getItem('seller');
      const userStore = localStorage.getItem('user');

      this.sellerName = sellerStore
        ? JSON.parse(sellerStore)[0]?.name || ''
        : '';
      this.userName = userStore ? JSON.parse(userStore).name || '' : '';
      this.cdRef.detectChanges();
    }
  }

  updateMenuType(url: string): void {
    this.menuType = url.includes('seller') ? 'seller' : 'default';
  }

  login(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
      this.userName = user.name;
      this.checkLoginStatus();
      this.route.navigate(['/']);
    }
  }

  logout(): void {
    this.userService.logout();
    this.sellerName = '';
    this.userName = '';
    this.menuType = 'default';
    this.cdRef.detectChanges();
  }

  searchProducts(query: string): void {
    if (query.trim()) {
      this.productService.searchProducts(query).subscribe((result) => {
        this.searchResult = result.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
      });
    } else {
      this.searchResult = [];
    }
  }

  hideSearch(): void {
    setTimeout(() => {
      this.searchResult = [];
    }, 200);
  }

  submitSearch(val: string): void {
    if (val) {
      this.route.navigate([`search/${val}`]);
      this.searchResult = [];
    }
  }

  redirectToDetails(id: number) {
    this.searchResult = [];
    this.route.navigate(['/details/', id]);
  }
}
