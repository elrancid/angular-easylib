import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Loggable } from '@easylib/log';

interface DomElementType {
  parentElement: any;
  getAttribute: (attr: string) => string;
  setAttribute: (name: string, value: string) => void;
  children: any;
  offsetLeft: number;
  offsetTop: number;
  offsetWidth: number;
  offsetHeight: number;
  getBoundingClientRect: () => any;
  style: any;
}

type DirectionType = 'vertical' | 'horizontal';
type StylePropertyType = 'height' | 'width';
type SizePropertyType = 'offsetWidth' | 'offsetHeight'; // property to get the size from native element

type CommonResizeType = { // must to get sizeProperty only for element and siblings
  sizeProperty: SizePropertyType;
};

type ElementResizeType = CommonResizeType & {
  direction: DirectionType;
};
type ParentResizeType = { // parent doesn't must have sizeProperty because can be a nested sibling.
  direction: DirectionType;
  children?: Array<SiblingType>;
};
type SiblingResizeType = CommonResizeType & {
  size?: number;
  percent?: number;
  styleProperty?: StylePropertyType;
  removeStylePx?: number;
};

type ElementType = DomElementType & {
  resize: ElementResizeType;
};
type ParentType = DomElementType & {
  resize: ParentResizeType;
};
type SiblingType = DomElementType & {
  resize: SiblingResizeType;
};

type ResizerModeType = 'flex' | 'block';


/**
 * See `./divider/divider.component` for how to use instructions.
 *
 * Code developed based on:
 * https://stackoverflow.com/questions/18368485/angular-js-resizable-div-directive
 * http://plnkr.co/edit/Zi2f0EPxmtEUmdoFR63B?p=preview&preview
 * And looking how https://jsfiddle.net/ works.
 * For other example:
 * https://www.syncfusion.com/angular-ui-components/angular-splitter
 * http://blackgate.github.io/bg-splitter/
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[resizer]',
})
export class ResizerDirective extends Loggable implements OnInit {

  public override logs = false;

  private moving = false;
  private startX!: number;
  private startY!: number;

  private element!: ElementType;
  private parent!: ParentType;
  private siblings?: Array<SiblingType>;
  private prevSibling?: SiblingType;
  private nextSibling?: SiblingType;
  private nearSiblingsTotalPercent!: number;

  @Input('resizer') resizeDirection?: string;

  // tslint:disable-next-line: no-input-rename
  @Input('resizer-mode') resizerMode: ResizerModeType = 'flex';

  constructor(private el: ElementRef) {
    super();
  }

  ngOnInit(): void {
    this.element = this.el.nativeElement;
    this.parent = this.element.parentElement;
    this.log('ResizerDirective.ngOnInit() element:', this.element);
    this.log('ResizerDirective.ngOnInit() parent:', this.parent);
    let direction: DirectionType = this.element.getAttribute('resizer') === 'vertical' ? 'vertical' : 'horizontal';
    // If parent already processed, get direction from parent
    if (this.parent && this.parent.resize && this.parent.resize.direction) {
      direction = this.parent.resize.direction;
      this.log('°°°°°°°°°° PARENT ALREADY SET direction[' + (typeof direction) + ']:', direction);
      // this.resizeDirection = direction;
      this.element.setAttribute('resizer', direction);
    }
    const sizeProperty: SizePropertyType = direction === 'vertical' ? 'offsetHeight' : 'offsetWidth';
    this.element.resize = { direction, sizeProperty };
    this.log('ResizerDirective.ngOnInit() element.resize:', this.element.resize);
    // If parent is not already processed...
    if (!this.parent.resize || !this.parent.resize.direction) {
      // set attribute for css
      this.parent.setAttribute('resizer-container', direction);
      // set attribute for css (version 1)
      // if (this.resizerVersion) {
      //   this.parent.setAttribute('resizerVersion', this.resizerVersion);
      // }
      this.parent.setAttribute('resizer-mode', this.resizerMode);
      const styleProperty: StylePropertyType = direction === 'vertical' ? 'height' : 'width';
      // ... then looking for siblings
      this.siblings = [];
      // prepare parent's resize object...
      if (!this.parent.resize) {
        this.parent.resize = { direction };
      }
      else {
        this.parent.resize.direction = direction;
      }
      this.log('ResizerDirective.ngOnInit() parent:', this.parent);
      // const parentChildren = this.el.nativeElement.parentElement.children;
      // this.log('ResizerDirective.ngOnInit() parentChildren:', parentChildren);
      let getNextSibling = false;
      for (const element of this.parent.children) {
        // const elementResizer = element.getAttribute('resizer');
        // this.log('ResizerDirective.ngOnInit() elementResizer[' + (typeof elementResizer) + ']:', elementResizer);
        if (element.getAttribute('resizer') === null) {
          this.siblings.push(element);
          // set attribute for css
          element.setAttribute('resizer-panel', '');
          // set attribute for css (version 1)
          // if (this.resizerVersion) {
          //   element.setAttribute('resizerVersion', this.resizerVersion);
          // }
          if (getNextSibling) {
            this.log('FOUND NEXT');
            this.nextSibling = this.siblings.slice(-1).pop();
            getNextSibling = false;
          }
        }
        if (element === this.element) {
          this.log('FOUND! GET PREV');
          this.prevSibling = this.siblings.slice(-1).pop();
          getNextSibling = true;
        }
      }
      // siblings found, calulate percent sizes...
      this.log('ResizerDirective.ngOnInit() siblings:', this.siblings);
      let totalPercent = 0;
      let countEmptyPercent = 0;
      this.siblings.forEach((element: SiblingType, i: number) => {
        if (!element.resize) {
          element.resize = { sizeProperty };
        }
        else {
          element.resize.sizeProperty = sizeProperty;
        }
        const percent = parseFloat(element.getAttribute('resize-percent'));
        if (!isNaN(percent)) {
          element.resize.percent = percent;
          totalPercent += percent;
        } else {
          countEmptyPercent++;
        }
        this.log('ResizerDirective.ngOnInit() siblings[' + i + ']:', element);
        this.log('ResizerDirective.ngOnInit() percent:', percent);
      });
      this.log('ResizerDirective.ngOnInit() totalPercent:', totalPercent, 'countEmptyPercent:', countEmptyPercent);

      // If some sibling doesn't has percent set yet
      if (countEmptyPercent > 0) {
        const percent = (100 - totalPercent) / countEmptyPercent;
        this.siblings.forEach((element: SiblingType, i: number) => {
          if (element.resize.percent === undefined) {
            element.resize.percent = percent;
            totalPercent += percent;
            countEmptyPercent--;
          }
        });
      }
      this.log('ResizerDirective.ngOnInit() totalPercent:', totalPercent, 'countEmptyPercent:', countEmptyPercent);
      // Set starting percent size for every siblings
      const length = this.siblings.length;
      this.siblings.forEach((element: SiblingType, i: number) => {
        let removeStylePx = 1.0;
        if (i === 0 || i === (length - 1)) {
          removeStylePx = 0.5;
        }
        element.resize.styleProperty = styleProperty;
        element.resize.removeStylePx = removeStylePx;
        // element.style[styleProperty] = `calc(${element.resize.percent}% - ${removeStylePx}px`;
        this.setPercentSize(element, element.resize.percent as number);
      });
      // add siblings to parent's children
      this.parent.resize.children = this.siblings;
    }
    else {
      // Get resizer direction from parent
      // const direction = this.parent.getAttribute('resizer-container');
      // this.log('********** PARENT ALREADY SET direction[' + (typeof direction) + ']:', direction);
      // this.resizeDirection = direction;
      // Get resizer-mode from parent
      const resizerMode = this.parent.getAttribute('resizer-mode');
      this.log('********** PARENT ALREADY SET resizer-mode[' + (typeof resizerMode) + ']:', resizerMode);
      this.resizerMode = this.parent.getAttribute('resizer-mode') === 'block' ? 'block' : 'flex';
      // ... else get siblings from parent's children
      this.siblings = this.parent.resize.children;
      // this.log('ResizerDirective.ngOnInit() ******** siblings:', this.siblings);
      // looking for prev and next sibling
      let getNextSibling = false;
      let lastValidElement;
      for (const element of this.parent.children) {
        // const elementResizer = element.getAttribute('resizer');
        // this.log('ResizerDirective.ngOnInit() elementResizer[' + (typeof elementResizer) + ']:', elementResizer);
        if (element.getAttribute('resizer') === null) {
          lastValidElement = element;
          if (getNextSibling) {
            this.log('FOUND NEXT');
            this.nextSibling = lastValidElement;
            getNextSibling = false;
          }
        }
        if (element === this.element) {
          this.log('FOUND! GET PREV');
          this.prevSibling = lastValidElement;
          getNextSibling = true;
        }
      }
    }
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    // this.log('ResizerDirective.onMouseDown() [x,y]=[' + event.x + ',' + event.y + ']');
    // this.log('ResizerDirective.onMouseDown() element:', this.element);
    // this.log('ResizerDirective.onMouseDown() element.width:', this.element.width);
    // this.log('ResizerDirective.onMouseDown() element.height:', this.element.height);
    // this.log('ResizerDirective.onMouseDown() element.offsetWidth:', this.element.offsetWidth);
    // this.log('ResizerDirective.onMouseDown() element.offsetHeight:', this.element.offsetHeight);
    // this.log('ResizerDirective.onMouseDown() parentElement:', this.el.nativeElement.parentElement);
    // this.log('ResizerDirective.onMouseDown() parentNode:', this.el.nativeElement.parentNode);
    // this.log('ResizerDirective.onMouseDown() parent:', this.parent);
    // this.log('ResizerDirective.onMouseDown() siblings:', this.el.nativeElement.parentElement.children);
    // this.log('ResizerDirective.onMouseDown() siblings:', this.siblings);
    this.startX = event.x;
    this.startY = event.y;
    if (this.prevSibling && this.nextSibling) {
      this.prevSibling.resize.size = this.prevSibling[this.prevSibling.resize.sizeProperty];
      const prevSiblingResizePercent = this.prevSibling.resize.percent || 0;
      this.nextSibling.resize.size = this.nextSibling[this.nextSibling.resize.sizeProperty];
      const nextSiblingResizePercent = this.nextSibling.resize.percent || 0;
      this.nearSiblingsTotalPercent = prevSiblingResizePercent + nextSiblingResizePercent;
    }
    // this.log('prevSibling:', this.prevSibling);
    // this.log('nextSibling:', this.nextSibling);
    this.moving = true;
  }

  @HostListener('document:mouseup') onMouseUp(): void {
    // this.log('ResizerDirective.onMouseUp()');
    if (this.moving) {
      this.moving = false;
    }
  }
  @HostListener('document:mousemove', ['$event']) onMouseMove(event: any): void {
    // event.preventDefault();
    // this.log('ResizerDirective.onMouseMove() event:', event);
    if (this.moving) {
      this.mouseMove(event);
    }
  }

  // @Input() defaultColor: string;

  // tslint:disable-next-line: no-input-rename
  // @Input('appHighlight') highlightColor: string;


  private mouseMove(e: any): void {
    // this.log('ResizerDirective.mouseMove() e:', e);
    // this.log(`[dX,dY]=[${(e.x - this.startX)},${(e.y - this.startY)}] - movement[x,y]=[${e.movementX},${e.movementY}] - offset[x,y]=[${e.offsetX}',${e.offsetY}] - layer[x,y]=[${e.layerX}',${e.layerY}] - [x,y]=[${e.x}',${e.y}] - page[x,y]=[${e.pageX}',${e.pageY}] - client[x,y]=[${e.clientX}',${e.clientY}] - screen[x,y]=[${e.screenX}',${e.screenY}]`);
    // const resizeDirection = this.el.nativeElement.getAttribute('resizer');
    // this.log('ResizerDirective.mouseMove() resizeDirection:', resizeDirection);

    let delta;
    let movement;
    // let total;
    // let relativePositionInParent;
    if (this.element.resize.direction === 'vertical') {
      delta = e.y - this.startY;
      movement = e.movementY;
      // total = this.parent.offsetHeight;
      // relativePositionInParent = this.element.offsetTop + 0.5;
    }
    else {
      delta = e.x - this.startX;
      movement = e.movementX;
      // total = this.parent.offsetWidth;
      // relativePositionInParent = this.element.offsetLeft + 0.5;
    }
    if (movement !== 0) {
      // const percentPositionInParent = relativePositionInParent * 100 / total;
      // this.log('ResizerDirective.mouseMove() movement:', movement, 'delta:', delta, 'total:', total, 'relativePositionInParent:', relativePositionInParent, 'percentPositionInParent:', percentPositionInParent);

      // const prevSiblingResize = this.prevSibling.resize;
      // const nextSiblingResize = this.nextSibling.resize;
      const prevSiblingSize = this.prevSibling?.resize.size || 0;
      const nextSiblingSize = this.nextSibling?.resize.size || 0;

      // const prevSiblingResizePercent = this.prevSibling.resize.percent;
      // const nextSiblingResizePercent = this.nextSibling.resize.percent;
      // this.log('prevSiblingSize:', prevSiblingSize, 'nextSiblingSize:', nextSiblingSize, 'nearSiblingsTotalSize:', nearSiblingsTotalSize, 'prevSiblingResizePercent:', prevSiblingResizePercent, 'nextSiblingResizePercent:', nextSiblingResizePercent, 'nearSiblingsTotalPercent:', nearSiblingsTotalPercent);

      // const newPercentPositionInParent = (relativePositionInParent + delta) * 100 / total;
      const newPrevSiblingSize = prevSiblingSize + delta;
      const newNextSiblingSize = nextSiblingSize - delta;

      if (newPrevSiblingSize >= 5 && newNextSiblingSize >= 5) {
        const nearSiblingsTotalSize = prevSiblingSize + nextSiblingSize;
        // const nearSiblingsTotalPercent = prevSiblingResizePercent + nextSiblingResizePercent;
        // this.log('newPercentPositionInParent:', newPercentPositionInParent, 'newPrevSiblingSize:', newPrevSiblingSize);

        // const oldPrevSiblingPercent = prevSiblingSize * nearSiblingsTotalPercent / nearSiblingsTotalSize;
        // const oldNextSiblingPercent = nearSiblingsTotalPercent - oldPrevSiblingPercent;
        const newPrevSiblingPercent = newPrevSiblingSize * this.nearSiblingsTotalPercent / nearSiblingsTotalSize;
        const newNextSiblingPercent = this.nearSiblingsTotalPercent - newPrevSiblingPercent;
        this.log(`NEW sizes prev: ${newPrevSiblingSize} next: ${newNextSiblingSize} - percent prev: ${newPrevSiblingPercent} next: ${newNextSiblingPercent}`);

        if (this.prevSibling) {
          this.setPercentSize(this.prevSibling, newPrevSiblingPercent);
        }
        if (this.nextSibling) {
          this.setPercentSize(this.nextSibling, newNextSiblingPercent);
        }
      }
    }
  }

  private setPercentSize(element: SiblingType, percent: number): void {
    element.resize.percent = percent;
    if (this.resizerMode === 'block') {
      if (element.resize.styleProperty) {
        element.style[element.resize.styleProperty] = `calc(${percent}% - ${element.resize.removeStylePx}px)`;
      }
    }
    else {
      element.style['flex-basis'] = `calc(${percent}% - ${element.resize.removeStylePx}px)`;
    }
  }

}
