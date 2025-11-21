import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { ContactItem, ContactRequest } from '../../../core/models/contact.model';
import { CustomDatePipe } from "../../../shared/pipes/DatePipe ";
import { LeadItem } from '../../../core/models/lead.models';
import { StaffItem } from '../../../core/models/staff.model';
import { StaffService } from '../../../core/services/staff.service';
import { LeadService } from '../../../core/services/lead.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  imports: [CommonModule, RouterModule, CustomDatePipe, FormsModule],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css'],
})
export class ContactListComponent {

  contacts: ContactItem[] = [];
  contactForm: ContactRequest = {} as ContactRequest;
  isLoading: boolean = false;
  showAddPopup: boolean = false;
  selectedStaff: string = '';
  selectedLead: string = '';
  leads: LeadItem[] = [];
  staffs: StaffItem[] = [];

  constructor(private contactService: ContactService, 
              private staffService: StaffService, 
              private leadService: LeadService ,
              private router: Router){}

  ngOnInit(){
    this.onListContact();
  }

  onListContact(){
    this.contactService.GetListContact().subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.contacts = res.data?.contacts ?? [];

        console.log(res);
      },
      error: (err) => {
        console.log("Lỗi: ", err);
      }
    })
  } 

  onInfContact(idContact: string){
    this.router.navigate(['/contact-detail'], { queryParams: { id: idContact } })
  }

  submitAddContact(){
    this.isLoading = true;
      
    this.contactService.createContact(this.contactForm, this.selectedStaff, this.selectedLead).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
          
        this.contacts = res.data?.contacts ?? [];
        console.log(res);
  
        this.contactForm = {} as ContactRequest;
  
        this.isLoading = false;
        this.closePopup();
        this.onListContact();
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  deleteContact(idContact: string, event: MouseEvent){
    event.stopPropagation();

    this.contactService.DeleteContact(idContact).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        alert(res.data.deleteContact);

        this.onListContact();
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  onListLead(){
    this.leadService.GetListLead().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.leads = res.data?.leads ?? [];

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
    this.onListLead();
    this.onListStaff();
  }

  closePopup(){
    this.showAddPopup = false;
  }
}
