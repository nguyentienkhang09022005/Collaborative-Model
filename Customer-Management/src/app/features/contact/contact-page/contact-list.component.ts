import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { ContactItem } from '../../../core/models/contact.model';
import { CustomDatePipe } from "../../../shared/pipes/DatePipe ";

@Component({
  selector: 'app-contact-page',
  imports: [CommonModule, RouterModule, CustomDatePipe],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css'],
})
export class ContactListComponent {

  contacts: ContactItem[] = [];
  isLoading: boolean = false;
  showAddPopup: boolean = false;

  constructor(private contactService: ContactService, 
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

  openAddPopup(){
    this.showAddPopup = true;
  }

  closePopup(){
    this.showAddPopup = false;
  }
}
