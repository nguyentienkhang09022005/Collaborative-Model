import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LeadService } from '../../../core/services/lead.service';
import { LeadItem, LeadRequest } from '../../../core/models/lead.models';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../core/services/search.service';
import { SearchRequest } from '../../../core/models/elasticsearch.model';

@Component({
  selector: 'app-lead-page',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lead-list.html',
  styleUrls: ['./lead-list.css'],
})
export class LeadListComponent {
  
  leads: LeadItem[] = [];
  leadForm: LeadRequest = {} as LeadRequest;
  searchInput: SearchRequest = {} as SearchRequest;
  isLoading: boolean = false;
  openMenu: any = null;
  showAddPopup: boolean = false;
  showUploadPopup: boolean = false;
  selectedFile!: File;
  
  constructor(private leadService: LeadService, 
              private searchService: SearchService,
              private router: Router){}

  ngOnInit(){
    this.onListLead();
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

  onInfLead(idLead: string){
    this.router.navigate(['/lead-detail'], { queryParams: { id: idLead } })
  }

  submitAddLead(){
    this.isLoading = true;

    this.leadService.createLead(this.leadForm).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.leads = res.data?.leads ?? [];
        console.log(res);

        this.leadForm = {} as LeadRequest;

        this.isLoading = false;
        this.closePopup();
        this.onListLead();
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  deleteLead(idLead: string, event: MouseEvent){
    event.stopPropagation();

    this.leadService.DeleteLead(idLead).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        alert(res.data.deleteLead);

        this.openMenu = null;
        this.onListLead();
      },
      error: (err) => {
        this.isLoading = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  SearchLead(){
    this.searchService.SearchLead(this.searchInput.keyword).subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.leads = res.data?.searchLeads ?? [];
      },
      error: (err) => {
        console.log("Lỗi: ", err);
      }
    })
  }

  uploadExcel(){
    if (!this.selectedFile) {
      alert("Hãy chọn file để tải lên!");
      return;
    }

    this.leadService.UploadExcelLead(this.selectedFile).subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        alert("Tải lên danh sách khách hàng tiềm năng thành công!");
        this.closeUploadPopup();
        this.onListLead();
      },
      error: (err) => {
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

  openUploadPopup() {
    this.showUploadPopup = true;
  }

  closeUploadPopup() {
    this.showUploadPopup = false;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
