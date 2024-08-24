import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currency = '$';

  productsData: any; 
  loader = true;
  loaderShowed = true;

  scrollTo(target: HTMLElement,product?: any) {
    target.scrollIntoView({ behavior: 'smooth' });
    if (product) {
      this.form.patchValue({product: product.title + ' (' + product.price + ' ' + this.currency + ')'});
    }
  }

  switchSugarFree(e: any) {
    this.http.get("https://testologia.ru/cookies" + (e.currentTarget.checked ? '?sugarfree' : ''))
      .subscribe(data => this.productsData = data);
  }


  form = this.fb.group({
    product:['', Validators.required],
    name:['', Validators.required],
    phone:['', Validators.required],
  })

  mainImageStyle: any;
  orderImageStyle: any;
  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e: MouseEvent){
    this.mainImageStyle = {transform:"translate(" + ((e.clientX * 0.3) / 8) + "px," + ((e.clientY * 0.3) / 8) + "px)"}
    this.orderImageStyle = {transform:"translate(-" + ((e.clientX * 0.3) / 8) + "px,-" + ((e.clientY * 0.3) / 8) + "px)"}
  }



  constructor(private fb:FormBuilder, private http: HttpClient){

  }


  ngOnInit(){
    setTimeout(() =>{
      this.loaderShowed = false;
    },2000);
    setTimeout(() =>{
      this.loader = false;
    },3000);

    this.http.get("https://testologia.ru/cookies").subscribe(data => this.productsData = data)
  }


  changeCurrency() {
    let newCurrency = '$';
    let coeficient = 1;
    if (this.currency === '$') {
      newCurrency = '₽';
      coeficient = 90;
    } else if (this.currency === '₽') {
      newCurrency = 'BYN';
      coeficient = 3;
    } else if (this.currency === 'BYN') {
      newCurrency = 'UZS';
      coeficient = 12604;
    } else if (this.currency === 'UZS') {
      newCurrency = '€';
      coeficient = 1;
    } else if (this.currency === '€') {
      newCurrency = '₴';
      coeficient = 44;
    } else if (this.currency === '₴') {
      newCurrency = '¥';
      coeficient = 7.25;
    }

    this.currency = newCurrency;

    this.productsData.forEach((item: any) => {
      item.price = +(item.basePrice * coeficient).toFixed(1);
    });
  }



  confirmOrder(){
    if (this.form.valid) {
      alert('Спасибо за заказ! Мы скоро свяжемся с вами!')
      this.http.post("https://testologia.ru/cookies-order", this.form.value)
      .subscribe({
        next: (response: any) =>{
          alert(response.message);
          this.form.reset()
        },
        error:(response: any) => {
          alert(response.error.message);
        }
      });
    }
  }
}
