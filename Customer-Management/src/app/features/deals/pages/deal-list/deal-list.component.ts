import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DealItem, DealRequest } from '../../../../core/models/deal.model';
import { CustomerItem } from '../../../../core/models/customer.model';
import { StaffItem } from '../../../../core/models/staff.model';
import { DealService } from '../../../../core/services/deal.service';
import { StaffService } from '../../../../core/services/staff.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';

@Component({
  selector: 'app-deal-page',
  imports: [CommonModule, RouterModule, FormsModule, CustomDatePipe],
  templateUrl: './deal-list.html',
  styleUrls: ['./deal-list.css'],
})
export class DealListComponent {
  deals: DealItem[] = [];
  DealForm: DealRequest = {} as DealRequest;
  isLoading: boolean = false;
  showAddPopup: boolean = false;
  selectedStaff: string = '';
  selectedCustomer: string = '';
  customers: CustomerItem[] = [];
  staffs: StaffItem[] = [];

  constructor(private dealService: DealService, 
              private staffService: StaffService, 
              private customerService: CustomerService ,
              private router: Router){}

  ngOnInit(){
    this.onListDeal();
  }

  onListDeal(){
    this.dealService.GetListDeal().subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.deals = res.data?.deals ?? [];

        console.log(res);
      },
      error: (err) => {
        console.log("Lỗi: ", err);
      }
    })
  } 

  onInfDeal(idContact: string){
    this.router.navigate(['/deal-detail'], { queryParams: { id: idContact } })
  }

  submitAddDeal(){
    this.isLoading = true;
      
    this.dealService.createDeal(this.DealForm, this.selectedStaff, this.selectedCustomer).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
          
        this.deals = res.data?.deals ?? [];
        console.log(res);
  
        this.DealForm = {} as DealRequest;
  
        this.isLoading = false;
        this.closePopup();
        this.onListDeal();
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  deleteDeal(idDeal: string, event: MouseEvent){
    event.stopPropagation();

    this.dealService.DeleteDeal(idDeal).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        alert(res.data.deleteDeal);

        this.onListDeal();
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
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

  onListStaff(){
    this.staffService.GetListStaff().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.staffs = res.data?.staffs ?? [];

        console.log(res);
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  openAddPopup(){
    this.showAddPopup = true;
    this.onListCustomer();
    this.onListStaff();
  }

  closePopup(){
    this.showAddPopup = false;
  }
}
