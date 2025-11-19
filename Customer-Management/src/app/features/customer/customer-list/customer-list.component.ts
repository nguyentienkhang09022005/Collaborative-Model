import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomerItem } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.css'],
})
export class CustomerListComponent {

  idCustmer: string = "";
  customers: CustomerItem[] = []
  isLoading: boolean = false;

  openMenu: any = null;
  
  constructor(private customerService: CustomerService, 
              private router: Router){}

  ngOnInit(){
    this.onListCustomer();
  }

  onListCustomer(){
    this.customerService.GetListCustomer().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.customers = res.data?.customers ?? [];
        console.log(res);
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  onInfLead(){
    this.customerService.GetInfCustomer(this.idCustmer).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.customers = res.data?.customers ?? [];
        console.log(res);
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  toggleMenu(item: any, event: MouseEvent) {
    event.stopPropagation();
    this.openMenu = this.openMenu === item ? null : item;
  }
}
