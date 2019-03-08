import { Component, OnInit } from '@angular/core';
import { RadioOption } from 'app/shared/radio/radio-option.model';
import { OrderService } from './order.service';
import { CartItem } from 'app/restaurant-detail/shopping-cart/cart-file.model';
import { Order, OrderItem } from './order.model';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import {tap} from 'rxjs/operators'

@Component({
  selector: 'mt-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  orderForm: FormGroup

  delivery: number = 8

  orderId: string

  emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

  numberPattern = /^[0-9]*$/

  paymentOptions: RadioOption[] = [
    {label: 'Dinheiro', value: 'MON'},
    {label: 'Cartão de Débito', value: 'DEB'},
    {label: 'Cartão de Refeição', value: 'REF'}
  ]

  itemsValue(): number {
    return this.orderService.itemsValue()
  }

  constructor(private orderService: OrderService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.orderForm = new FormGroup	({
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      email: this.formBuilder.control('', [Validators.required, Validators.pattern(this.emailPattern)]),
      emailConfirmation: this.formBuilder.control('', [Validators.required, Validators.pattern(this.emailPattern)]),
      address: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
      number: this.formBuilder.control('', [Validators.required, Validators.pattern(this.numberPattern)]),
      optionalAddress: this.formBuilder.control(''),
      paymentOptions: this.formBuilder.control('', [Validators.required])
    }, {validators: [OrderComponent.equalsTo], updateOn: 'blur'})
  }

  static equalsTo(group: AbstractControl): {[key: string]: boolean} {
    const email = group.get('email')
    const emailConfirmation = group.get('emailConfirmation')
    if ((email.value  && emailConfirmation.value) &&
        (email.value !== emailConfirmation.value)) {
      return { emailsNotMatch: true };
    }
    return undefined;
  }

  cartItems(): CartItem[] {
    return this.orderService.cartItems()
  }

  increaseQty(item: any) {
    this.orderService.increaseQty(item)
  }

  decreaseQty(item: any) {
    this.orderService.decreaseQty(item)
  }

  remove(item: any) {
    this.orderService.remove(item)
  }

  isOrderCompleted():boolean {
    return this.orderId !== undefined
  }

  checkOrder(order: Order) {
    order.orderItems = this.cartItems()
      .map((item:CartItem)=>new OrderItem(item.quantity, item.menuItem.id))
    this.orderService.checkOrder(order)
    .pipe(tap((orderId: string) =>  {
      this.orderId = orderId}))
      .subscribe((orderId: string) => {
        this.router.navigate(['/order-summary'])
        this.orderService.clear()
      })
  }
}