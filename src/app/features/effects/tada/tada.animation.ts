import { animate, animation, group, keyframes, query, style } from '@angular/animations';

export const tadaAnimation = animation([
  group([
    query('.tada-item:nth-child(1)', [
      animate('{{ time }} linear', keyframes([
        style({ left: '30%', width: '8px', opacity: 0, offset: 0 }),
        style({ left: '10%', width: '30px', opacity: 1, offset: 0.5 }),
        style({ left: '-40%', width: '10px', opacity: 1, offset: 0.9 }),
        style({ left: '-50%', width: '8px', opacity: 0, offset: 1 }),
      ]))
    ], { optional: true }),
    query('.tada-item:nth-child(2)', [
      animate('{{ time }} linear', keyframes([
        style({ left: '40%', top: '40%', width: '8px', opacity: 0, offset: 0 }),
        style({ left: '10%', top: '10%', width: '30px', opacity: 1, offset: 0.5 }),
        style({ left: '-15%', top: '-15%', width: '10px', opacity: 1, offset: 0.9 }),
        style({ left: '-25%', top: '-25%', width: '8px', opacity: 0, offset: 1 }),
      ]))
    ], { optional: true }),
    query('.tada-item:nth-child(3)', [
      animate('{{ time }} linear', keyframes([
        style({ top: '30%', width: '8px', opacity: 0, offset: 0 }),
        style({ top: '10%', width: '30px', opacity: 1, offset: 0.5 }),
        style({ top: '-40%', width: '10px', opacity: 1, offset: 0.9 }),
        style({ top: '-50%', width: '8px', opacity: 0, offset: 1 }),
      ]))
    ], { optional: true }),
    query('.tada-item:nth-child(4)', [
      animate('{{ time }} linear', keyframes([
        style({ left: '60%', top: '40%', width: '8px', opacity: 0, offset: 0 }),
        style({ left: '90%', top: '10%', width: '30px', opacity: 1, offset: 0.5 }),
        style({ left: '110%', top: '-15%', width: '10px', opacity: 1, offset: 0.9 }),
        style({ left: '120%', top: '-25%', width: '8px', opacity: 0, offset: 1 }),
      ]))
    ], { optional: true }),
    query('.tada-item:nth-child(5)', [
      animate('{{ time }} linear', keyframes([
        style({ left: '70%', width: '8px', opacity: 0, offset: 0 }),
        style({ left: '90%', width: '30px', opacity: 1, offset: 0.5 }),
        style({ left: '130%', width: '10px', opacity: 1, offset: 0.9 }),
        style({ left: '140%', width: '8px', opacity: 0, offset: 1 }),
      ]))
    ], { optional: true }),
    query('.tada-item:nth-child(6)', [
      animate('{{ time }} linear', keyframes([
        style({ left: '60%', top: '60%', width: '8px', opacity: 0, offset: 0 }),
        style({ left: '90%', top: '90%', width: '30px', opacity: 1, offset: 0.5 }),
        style({ left: '110%', top: '110%', width: '10px', opacity: 1, offset: 0.9 }),
        style({ left: '120%', top: '120%', width: '8px', opacity: 0, offset: 1 }),
      ]))
    ], { optional: true }),
    query('.tada-item:nth-child(7)', [
      animate('{{ time }} linear', keyframes([
        style({ top: '70%', width: '8px', opacity: 0, offset: 0 }),
        style({ top: '90%', width: '30px', opacity: 1, offset: 0.5 }),
        style({ top: '130%', width: '10px', opacity: 1, offset: 0.9 }),
        style({ top: '140%', width: '8px', opacity: 0, offset: 1 }),
      ]))
    ], { optional: true }),
    query('.tada-item:nth-child(8)', [
      animate('{{ time }} linear', keyframes([
        style({ left: '40%', top: '60%', width: '8px', opacity: 0, offset: 0 }),
        style({ left: '10%', top: '90%', width: '30px', opacity: 1, offset: 0.5 }),
        style({ left: '-15%', top: '110%', width: '10px', opacity: 1, offset: 0.9 }),
        style({ left: '-25%', top: '120%', width: '8px', opacity: 0, offset: 1 }),
      ]))
    ], { optional: true }),
  ])
]);
