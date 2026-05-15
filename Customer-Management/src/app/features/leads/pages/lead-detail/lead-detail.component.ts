import { Component } from '@angular/core';
import { LeadService } from '../../../../core/services/lead.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LeadItem, LeadRequest } from '../../../../core/models/lead.models';
import { CustomDatePipe } from '../../../../shared/pipes/date-pipe';

@Component({
  selector: 'app-lead-detail',
  imports: [CommonModule, FormsModule, CustomDatePipe],
  templateUrl: './lead-detail.html',
  styleUrls: ['./lead-detail.css'],
})
export class LeadDetailComponet {

  leadForm: LeadRequest = {} as LeadRequest;
  leadData: LeadItem[] = [];
  isLoading: boolean = false;
  isEditing: boolean = false;
  isSaveEdit: boolean = true;
  idLead: string = "";

  constructor(private leadService: LeadService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.route.queryParams.subscribe(param => {
      this.idLead = param['id']
      if (this.idLead){
        this.onInfLead(this.idLead)
      }
    })
  }

  onInfLead(idLead: string){
    this.leadService.GetInfLead(idLead).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }

        this.leadData = res.data?.leadById ?? [];

        const item = this.leadData[0];
        if (!item) return;

        this.leadForm = {
          idLead: item.idLead,
          resource: item.resource,
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

  onUpdateLead(){
    this.leadService.UpdateLead(this.leadForm, this.idLead).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.leadData = res.data?.updateLead ?? [];
        console.log(res);
        this.onInfLead(this.leadForm.idLead);
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
