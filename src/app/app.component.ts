import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AwNavigationMenuComponent,
  AwTopNavigationComponent,
  NavigationMenu,
  NavigationOptions,
  UserInformation,
  TopNavigationOptions,
  SearchOption,
  NavigationThemeLabel
} from '@assetworks-llc/aw-component-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AwNavigationMenuComponent,
    AwTopNavigationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fe-harness';

  navigationOptions = signal<NavigationOptions>({
    defaultHomePage: '/',
    enableAwLogo: true,
    onLogoClick: () => console.log('Logo clicked')
  });

  userInformation = signal<UserInformation>({
    userName: 'Test User',
    userId: 'TU'
  });

  menuItems = signal<NavigationMenu>({
    menu: [
      { title: 'Home', active: true },
      { title: 'Feature Page' }
    ]
  });

  topNavOptions = signal<TopNavigationOptions>({
    locationFilter: false,
    profileBarColor: NavigationThemeLabel.LtGrey
  });

  searchOptions = signal<SearchOption[]>([]);
}
