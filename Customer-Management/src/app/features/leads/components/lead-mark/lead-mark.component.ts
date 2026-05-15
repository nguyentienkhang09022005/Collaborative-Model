import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeadService } from '../../../../core/services/lead.service';
import { LeadItem, LeadRequest } from '../../../../core/models/lead.models';

@Component({
  selector: 'app-lead-mark',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lead-mark.html',
  styleUrls: ['./lead-mark.css'],
})
export class LeadMarkComponent {

  isLoading: boolean = false;
  leads: LeadItem[] = [];
  leadForm: LeadRequest = {} as LeadRequest;
  showAddPopup: boolean = false;

  constructor(private leadService: LeadService ){}

  ngOnInit(){}

  submitAddLead(){
    this.isLoading = true;
  
    this.leadService.createLead(this.leadForm).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }  
        this.leadForm = {} as LeadRequest;
  
        this.isLoading = false;
        alert("Đăng ký tư vấn thành công!");
  
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
  }

  closePopup(){
    this.showAddPopup = false;
  }
}
