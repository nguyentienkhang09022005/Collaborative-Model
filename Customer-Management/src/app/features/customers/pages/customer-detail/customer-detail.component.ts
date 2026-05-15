import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';
import { CustomerItem, CustomerRequest } from '../../../../core/models/customer.model';
import { CustomerService } from '../../../../core/services/customer.service';

@Component({
  selector: 'app-customer-detail',
  imports: [CommonModule, FormsModule, CustomDatePipe],
  templateUrl: './customer-detail.html',
  styleUrls: ['./customer-detail.css'],
})
export class CustomerDetailComponet {

  customerForm: CustomerRequest = {} as CustomerRequest;
  customerData: CustomerItem[] = [];
  isLoading: boolean = false;
  isEditing: boolean = false;
  isSaveEdit: boolean = true;
  idCustomer: string = "";

  constructor(private customerService: CustomerService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.route.queryParams.subscribe(param => {
      this.idCustomer = param['id']
      if (this.idCustomer){
        this.onInfCustomer(this.idCustomer)
      }
    })
  }

  onInfCustomer(idCustomer: string){
    this.customerService.GetInfCustomer(idCustomer).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }

        this.customerData = res.data?.customerById ?? [];

        const item = this.customerData[0];
        if (!item) return;

        this.customerForm = {
          idCustomer: item.idCustomer,
          fullname: item.personResponse.fullname,
          email: item.personResponse.email,
          phone: +item.personResponse.phone,
          salary: item.personResponse.salary,
          location: item.personResponse.location,
          createdAt: item.createdAt
        }

        console.log(res);
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  onUpdateCustomer(){
    this.customerService.UpdateCustomer(this.customerForm, this.idCustomer).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.customerData = res.data?.updateCustomer ?? [];
        console.log(res);
        this.onInfCustomer(this.customerForm.idCustomer);
        alert("Cập nhật thông tin thành công!");

        this.isEditing = false;
        this.isSaveEdit = true;
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  onEdit() {
    this.isEditing = true;
    this.isSaveEdit = false;
  }
}
