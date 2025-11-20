import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerItem, CustomerRequest } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-page',
  imports: [CommonModule, RouterModule, FormsModule, ],
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.css'],
})
export class CustomerListComponent {
  
  idCustomer: string = "";
  customers: CustomerItem[] = [];
  customerForm: CustomerRequest = {} as CustomerRequest;
  isLoading: boolean = false;
  openMenu: any = null;
  showAddPopup: boolean = false;
  
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

  onInfCustomer(idCustomer: string){
    this.router.navigate(['/customer-detail'], { queryParams: { id: idCustomer } })
  }

  submitAddCustomer(){
    this.isLoading = true;
    
    this.customerService.createCustomer(this.customerForm).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.customers = res.data?.customers ?? [];
        console.log(res);

        this.customerForm = {} as CustomerRequest;

        this.isLoading = false;
        this.closePopup();
        this.onListCustomer();
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  deleteCustomer(idCustomer: string, event: MouseEvent){
    event.stopPropagation();

    this.customerService.DeleteCustomer(idCustomer).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        alert(res.data.deleteCustomer);

        this.openMenu = null;
        this.onListCustomer();
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

  openAddPopup(){
    this.showAddPopup = true;
  }

  closePopup(){
    this.showAddPopup = false;
  }

}
