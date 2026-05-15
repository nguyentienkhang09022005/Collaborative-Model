import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { InfStaff } from '../../core/models/auth.models';
import { AiService } from '../../core/services/ai.service';
import { ChatRequest, HistoryMessageItem } from '../../core/models/ai.model';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, FormsModule, ToastComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  currentStaff: InfStaff | null = null;
  historyMessageItem: HistoryMessageItem[] = [];
  chatForm: ChatRequest = {} as ChatRequest;

  isChatOpen = false;
  isChatBoxOpen = true;
  newMessage: string = '';
  aiTyping: boolean = false;
  isChatThinking: boolean = false;

  import { ToastService } from '../../core/services/toast.service';

  constructor (private authenService: AuthService,
               private aiService: AiService,
               private router: Router,
               private toastService: ToastService){}

  ngOnInit(): void{
    this.currentStaff = this.authenService.getCurrentStaff();
    this.onListHistoryMessage(this.currentStaff?.idStaff || "");

    setInterval(() => {
      this.showChatThinking();
    }, 20000);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  showChatThinking() {
    this.isChatThinking = true;

    setTimeout(() => {
      this.isChatThinking = false;
    },15000);
  }

  onLogout(event?: Event){
    if (event) event.preventDefault(); 
    this.authenService.logout().subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          this.toastService.error(res.errors[0].message);
          return;
        }
        
        this.router.navigate(['/authen'])
      },
      error: (err) => {console.log("Lỗi đăng xuất!", err)}
    })
  }

  onListHistoryMessage(idStaff: string){
    this.aiService.ListHistoryMessage(idStaff).subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          this.toastService.error(res.errors[0].message);
          return;
        }

        this.historyMessageItem = res.data?.historyMessage ?? [];

        console.log(res);
      },
      error: (err) => {
        console.log("Lỗi: ", err);
      }
    })
  }

  sendMessage(){
    const message = this.newMessage.trim();
    if (!message || !this.currentStaff) return;

    this.historyMessageItem.push({ role: 'user', message: message });
    this.newMessage = '';

    this.aiTyping = true;

    const chatRequest: ChatRequest = {
      idStaff: this.currentStaff.idStaff,
      userMessage: message
    };

    this.aiService.ChatWithAI(chatRequest).subscribe({
      next: (res) => {
        this.aiTyping = false;

        if (res.errors && res.errors.length > 0) {
          this.toastService.error(res.errors[0].message);
          return;
        }
          
        const aiMsg = res.data?.sendChatMessage;
        if (aiMsg) {
          this.historyMessageItem.push({ role: 'model', message: aiMsg.aiResponse });
        }        
      },
      error: (err) => {
        this.aiTyping = false;
        console.log("Lỗi: ", err);
      }
    })
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    this.isChatBoxOpen = !this.isChatOpen;
  }
}
