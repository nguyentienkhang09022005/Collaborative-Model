import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DealItem, DealRequest } from '../../../core/models/dead.model';
import { CustomerItem } from '../../../core/models/customer.model';
import { StaffItem } from '../../../core/models/staff.model';
import { DealService } from '../../../core/services/deal.service';
import { StaffService } from '../../../core/services/staff.service';
import { CustomerService } from '../../../core/services/customer.service';
import { CustomDatePipe } from "../../../shared/pipes/DatePipe ";

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
    this.onListContact();
  }

  onListContact(){
    this.dealService.GetListContact().subscribe({
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

  // onInfContact(idContact: string){
  //   this.router.navigate(['/contact-detail'], { queryParams: { id: idContact } })
  // }

  // submitAddContact(){
  //   this.isLoading = true;
      
  //   this.contactService.createContact(this.contactForm, this.selectedStaff, this.selectedLead).subscribe({
  //     next: (res) => {
  //       this.isLoading = false;
  //       if (res.errors && res.errors.length > 0) {
  //         alert(res.errors[0].message);
  //         return;
  //       }
          
  //       this.contacts = res.data?.contacts ?? [];
  //       console.log(res);
  
  //       this.contactForm = {} as ContactRequest;
  
  //       this.isLoading = false;
  //       this.closePopup();
  //       this.onListContact();
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       console.log("Lỗi: ", err);
  //     }
  //   })
  // }

  // deleteContact(idContact: string, event: MouseEvent){
  //   event.stopPropagation();

  //   this.contactService.DeleteContact(idContact).subscribe({
  //     next: (res) => {
  //       this.isLoading = false;

  //       if (res.errors && res.errors.length > 0) {
  //         alert(res.errors[0].message);
  //         return;
  //       }
        
  //       alert(res.data.deleteContact);

  //       this.onListContact();
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       console.log("Lỗi: ", err);
  //     }
  //   })
  // }

  // onListLead(){
  //   this.leadService.GetListLead().subscribe({
  //     next: (res) => {
  //       this.isLoading = false;
  //       if (res.errors && res.errors.length > 0) {
  //         alert(res.errors[0].message);
  //         return;
  //       }
        
  //       this.leads = res.data?.leads ?? [];

  //       console.log(res);
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       console.log("Lỗi: ", err);
  //     }
  //   })
  // }

  // onListStaff(){
  //   this.staffService.GetListStaff().subscribe({
  //     next: (res) => {
  //       this.isLoading = false;
  //       if (res.errors && res.errors.length > 0) {
  //         alert(res.errors[0].message);
  //         return;
  //       }
        
  //       this.staffs = res.data?.staffs ?? [];

  //       console.log(res);
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       console.log("Lỗi: ", err);
  //     }
  //   })
  // }

  // openAddPopup(){
  //   this.showAddPopup = true;
  //   this.onListLead();
  //   this.onListStaff();
  // }

  closePopup(){
    this.showAddPopup = false;
  }
}
