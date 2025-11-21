import { Component } from '@angular/core';
import { ContactItem, ContactRequest } from '../../../core/models/contact.model';
import { ContactService } from '../../../core/services/contact.service';
import { ActivatedRoute } from '@angular/router';
import { CustomDatePipe } from '../../../shared/pipes/DatePipe ';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-detail',
  imports: [CommonModule, FormsModule, CustomDatePipe],
  templateUrl: './contact-detail.html',
  styleUrls: ['./contact-detail.css'],
})
export class ContactDetailComponent {

  contactForm: ContactItem = {} as ContactItem;
  contactData: ContactItem[] = [];
  isLoading: boolean = false;
  isEditing: boolean = false;
  isSaveEdit: boolean = true;
  idContact: string = "";

  constructor(private contactService: ContactService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.route.queryParams.subscribe(param => {
      this.idContact = param['id']
      if (this.idContact){
        this.onInfContact(this.idContact)
      }
    })
  }

  onInfContact(idContact: string){
    this.contactService.GetInfContact(idContact).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }

        this.contactData = res.data?.contactById ?? [];

        const item = this.contactData[0];
        if (!item) return;

        this.contactForm = item;

        console.log(res);
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
