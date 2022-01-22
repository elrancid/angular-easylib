import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

/**
 * Divider (from mat-divider)
 *
 *
 * Import module:
 * `import { DividerModule } from '@easylib/material';`
 *
 *
 * Create an horizontal divider:
 * `<easy-divider></easy-divider>`
 *
 *
 * Create a vertical divider:
 * `<easy-divider [vertical]="true"></easy-divider>`
 *
 *
 * Create resizable horizontal blocks:
 * |-------|-------|
 * |       |       |
 * |       |       |
 * |       |       |
 * |-------|-------|
 * Inner divider resize left and right blocks.
 * ```
 * <div>
 *   <div>Left</div>
 *   <easy-divider resizer="horizontal" [vertical]="true"></easy-divider>
 *   <div>Right</div>
 * </div>
 * ```
 * `resizer` directive can be "horizontal" (default value) or "vertical".
 * When `resizer` is "horizontal" no need to set `[vertical]="true"`, it will be set automatically.
 * resizer="horizontal" set vertical="true" and resizer="vertical" set vertical="false".
 * In this example you can write a more compact:
 * ```
 * <div>
 *   <div>Left</div>
 *   <easy-divider resizer></easy-divider>
 *   <div>Right</div>
 * </div>
 * ```
 * Block can be resized >= 5px to prevent issues.
 *
 *
 * Create resizable vertical blocks:
 * |-------------|
 * |             |
 * |-------------|
 * |             |
 * |-------------|
 * ```
 * <div>
 *   <div>Left</div>
 *   <easy-divider resizer="vertical"></easy-divider>
 *   <div>Right</div>
 * </div>
 * ```
 *
 *
 * You can set default blocks sizes in percentual:
 * |----|----------|
 * |    |          |
 * |    |          |
 * |    |          |
 * |----|----------|
 * ```
 * <div>
 *   <div resize-percent="30">Left</div>
 *   <easy-divider resizer></easy-divider>
 *   <div>Right</div>
 * </div>
 * ```
 * In this example right block will use automatic remaining space.
 * Blocks without percent will share remaining space equaly.
 *
 *
 * With many resizers in same container the first one will set the direction:
 * |----|----|----|
 * |    |    |    |
 * |    |    |    |
 * |    |    |    |
 * |----|----|----|
 * ```
 * <div>
 *   <div>Left</div>
 *   <easy-divider resizer></easy-divider>
 *   <div>Right</div>
 *   <easy-divider resizer="vertical"></easy-divider>
 *   <div>Right</div>
 * </div>
 * ```
 * In this example `resizer="vertical"` will be ignored because first resizer is "horizontal".
 *
 *
 * It can be possible to insert a resizable block inside another resizable block to make compositions:
 * |-------------------|
 * |----|--------|-----|
 * |    |        |     |
 * |    |        |-----|
 * |----|        |     |
 * |    |        |-----|
 * |----|--------|     |
 * |-------------|-----|
 * ```
 * <div resize-percent="10">Top</div>
 * <easy-divider resizer="vertical"></easy-divider>
 * <div>
 *   <div>
 *     <div>
 *       <div resize-percent="20">
 *         <div resize-percent="70">SX Top</div>
 *         <easy-divider resizer="vertical"></easy-divider>
 *         <div>SX Bottom</div>
 *       </div>
 *       <easy-divider resizer></easy-divider>
 *       <div>Center</div>
 *     </div>
 *     <easy-divider resizer="vertical"></easy-divider>
 *     <div resize-percent="10">Bottom</div>
 *   </div>
 *   <easy-divider resizer></easy-divider>
 *   <div resize-percent="25">
 *     <div>DX Top</div>
 *     <easy-divider resizer="vertical"></easy-divider>
 *     <div>DX Center</div>
 *     <easy-divider resizer></easy-divider>
 *     <div>DX Bottom</div>
 *   </div>
 * </div>
 * ```
 *
 * By default, blocks will be set with flexbox. It can be possible to use old blocks method:
 * ```
 * <div>
 *   <div>Left</div>
 *   <easy-divider resizer resizer-mode="block"></easy-divider>
 *   <div>Right</div>
 * </div>
 * ```
 * Like "resizer" property, first resizer will set the mode.
 */
@Component({
  selector: 'easy-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent implements OnInit {

  @Input() logs = false;

  /**
   * Whether the divider is vertically aligned.
   */
  @Input() vertical = false;

  /**
   * Whether the divider is an inset divider.
   */
  @Input() inset = false;

  /**
   * Resizer directive.
   */
  @Input() resizer?: string;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.resizer !== null) {
      let resizerDirection: 'horizontal' | 'vertical' = (this.resizer === 'vertical' ? 'vertical' : 'horizontal');
      const resizerContainer = this.el.nativeElement.parentElement.getAttribute('resizer-container');
      if (resizerContainer !== null) {
        resizerDirection = resizerContainer;
      }
      this.vertical = (resizerDirection === 'horizontal' ? true : false);
    }
  }

}
