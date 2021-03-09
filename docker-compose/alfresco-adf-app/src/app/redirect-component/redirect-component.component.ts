import { Component } from "@angular/core";

@Component({
  selector: "redirect-component",
  templateUrl: "./redirect-component.component.html",
  styleUrls: ["./redirect-component.component.css"]
})
export class RedirectComponent {
  constructor() {
    window.location.href = 'https://alfresco-test.cern.ch/share';
  }
}
