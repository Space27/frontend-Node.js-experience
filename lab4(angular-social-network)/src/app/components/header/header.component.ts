import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'header-component',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    RouterLink
  ],
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() title: string = 'МОЖНОWEB';
  @Input() subtitle: string = 'ЗАГОЛОВОК';
  @Input() link: string = '/';
}
