import {Component, OnInit, Input, Output, Injectable, EventEmitter} from '@angular/core';

@Injectable()
@Component({
  selector: 'ae-csv-config-form',
  template: `
<style>
  .main-popup {
    width: 100%;
    height: 300px;
    overflow: auto;
  }
  .step-block {
    margin-bottom: 20px;
  }
  .step-label {
    font-size: large;
  }
  .example-image {
    max-width: 100%;
    height: auto;
    padding-right: 10px;
  }
  .desc {
    font-size: small
  }
</style>
<div class="popup-block" class="main-popup">
    <div class="step-block">
        <h4>Step 1: Choose how your data is arranged:</h4>
        <div *ngIf="addDataMode" class="desc">Limitation: entities (in column {{getDim()}}) should match the ones already used in the chart:
         {{getCountries()}} and so on… You can find more instructions <a href="#">on this web page</a>
        </div>
        <div>
            <label class="step-label"><input type="radio" name="choice" #choiceRows (change)="setChoice('rows')" [checked]="choice === 'rows'"> Time is in rows</label>
            <div *ngIf="!addDataMode" class="desc">Column 1: entities, Column 2: time points, Column 3 and on: indicators (<a href="#" (click)="switchExampleRows()">see example</a>)</div>
            <div *ngIf="addDataMode" class="desc">Column 1: {{getDim()}}, Column 2: {{getTime()}}, Column 3 and on: indicators (<a href="#" (click)="switchExampleRows()">see example</a>)</div>
        </div>
        <div *ngIf="isExampleRows" style="width: 100%;"><img src="./public/images/templates/time-as-rows-example.png" class="example-image"></div>
        <div>
            <label class="step-label"><input type="radio" name="choice" #choiceColumns (change)="setChoice('columns')" [checked]="choice === 'columns'"> Time is in columns</label>
            <div *ngIf="!addDataMode" class="desc">Column 1: entities, Column 2: indicators, Column 3 and on: time points (<a href="#" (click)="switchExampleColumns()">see example</a>)</div>
            <div *ngIf="addDataMode" class="desc">Column 1: {{getDim()}}, Column 2: indicators, Column 3 and on: time points (<a href="#" (click)="switchExampleColumns()">see example</a>)</div>
        </div>
        <div *ngIf="isExampleColumns" style="width: 100%;"><img src="./public/images/templates/time-as-columns-example.png" class="example-image"></div>
    </div>
    
    <div class="step-block">
        <h4 *ngIf="choice">Step 2: Pick a file:</h4>
        <div *ngIf="choice"><input type="file" (change)="onCsvFileChanged($event)" /></div>
    </div>
    
    <div class="step-block">
        <h4 *ngIf="file && choice">Step 3: Additional options:</h4>
        <div *ngIf="file && choice" class="btn-group">Delimiter:</div>
        <div *ngIf="file && choice" class="btn-group">
            <label class="btn btn-default" [(ngModel)]="delimiter" btnRadio=","> , </label>
            <label class="btn btn-default" [(ngModel)]="delimiter" btnRadio=";"> ; </label>
        </div>
    </div>
</div>

<div style="border-bottom: 1px solid #e5e5e5; margin: 30px -15px 30px -15px;"></div>

<div class="popup-footer">
    <div class="btn-group" style="width: 100%">
        <div class="row" style="vertical-align: bottom; position: relative; ">
            <div class="col-sm-4">
                <div><a href="#">How to export a file from MS Excel</a></div>
                <div><a href="#">How to export a file from Google Docs</a></div>
                <div><a href="#">Online csv validator (a handy tool)</a></div>
                <div><a href="#">How do we use your data?</a></div>
           </div>
           <div class="col-sm-8" style="vertical-align: bottom; text-align: right; position: absolute; bottom: 0; right: 0;">
                <input type="button" (click)="close()" value="Cancel" />
                <input type="button" (click)="ok()" [disabled]="!choice || !file || !delimiter" value="Ok" />        
           </div>
       </div>
    </div>
</div>
`
})
export class CsvConfigFormComponent implements OnInit {
  @Input() parent?: any;
  @Input() addDataMode?: boolean = false;
  @Output() done: EventEmitter<any> = new EventEmitter();

  private choice: string = '';
  private isExampleRows: boolean = false;
  private isExampleColumns: boolean = false;
  private delimiter: string = ',';
  private file: string = '';

  ngOnInit() {
  }

  ok() {
    this.done.emit({
      reader: this.choice === 'columns' ? 'csv-time_in_columns' : 'csv',
      path: this.file,
      delimiter: this.delimiter
    });
    this.reset();
  }

  close() {
    this.done.emit(null);
  }

  private reset() {
    this.choice = '';
    this.isExampleRows = false;
    this.isExampleColumns = false;
    this.file = '';
  }

  private getDim(): string {
    return this.parent ? this.parent.getCurrentTab().component.model.state.marker._getFirstDimension() : null;
  }

  private getTime(): string {
    return this.parent ? this.parent.getCurrentTab().component.model.state.time.dim : null;
  }

  private getCountries() {
    const dim = this.getDim();

    return this.parent ? this.parent.getCurrentTab().component.model.state.marker.getKeys().slice(0, 5).map(d => d[dim]).join(", ") : null;
  }

  private switchExampleRows() {
    this.isExampleRows = !this.isExampleRows;
  }

  private switchExampleColumns() {
    this.isExampleColumns = !this.isExampleColumns;
  }

  private onCsvFileChanged(event) {
    if (event.srcElement.files && event.srcElement.files.length > 0) {
      this.file = event.srcElement.files[0].path;
    }
  }

  private setChoice(choice) {
    this.choice = choice;
  }
}