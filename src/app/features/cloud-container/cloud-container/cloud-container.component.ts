import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'app-cloud-container, [app-cloud-container]',
  templateUrl: './cloud-container.component.html',
  styleUrls: ['./cloud-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloudContainerComponent {

  private static positions = [
    'translate(-25%, 0)',
    'translate(0%, 0)',
    'translate(25%, 0)',
  ];

  @HostBinding('style.transform') randomTranslate = 'translate(0, 0)';

  cloudSymbol: string;


  constructor() {
    this.cloudSymbol = `#cloud-${Math.floor(Math.random() * Math.floor(6)) + 1}`;
    this.randomTranslate = CloudContainerComponent.positions[Math.floor(Math.random() * Math.floor(3))];
  }

}
