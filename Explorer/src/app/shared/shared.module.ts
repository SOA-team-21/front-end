import { NgModule } from "@angular/core";
import { MapComponent } from "./map/map.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
//import { LayoutModule } from "../feature-modules/layout/layout.module";
import { AuthModule } from "../infrastructure/auth/auth.module";
import { MaterialModule } from "../infrastructure/material/material.module";
import { AppRoutingModule } from "../infrastructure/routing/app-routing.module";

@NgModule({
    declarations: [
        MapComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        //LayoutModule,
        BrowserAnimationsModule,
        MaterialModule,
        AuthModule,
        HttpClientModule,
        FormsModule,
        RouterModule,
    ],
    exports: [
        MapComponent
    ]
})

export class SharedModule {}