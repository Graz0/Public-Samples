import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import { sp } from '@pnp/sp';
import "@pnp/polyfill-ie11";
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";

import * as strings from 'ExcelGraphWebPartStrings';

import ExcelGraph from './components/ExcelGraph';
import { IExcelGraphProps } from './components/ExcelGraph';
import { MSGraphClient } from '@microsoft/sp-http';

export interface IExcelGraphWebPartProps {
  libraryId: string;
}

export default class ExcelGraphWebPart extends BaseClientSideWebPart<IExcelGraphWebPartProps> {
  private graphClient: MSGraphClient;

  public async onInit(): Promise<void> {
    //Initialize PnPLogger
    Logger.subscribe(new ConsoleListener());
    Logger.activeLogLevel = LogLevel.Info;
    //Initialize PnPJs
    sp.setup({
      spfxContext: this.context
    });
    this.graphClient = await this.context.msGraphClientFactory.getClient();
    return;
  }

  public async render(): Promise<void> {
    //tenant.sharepoint.com,3923d07d-9cee-4574-be34-04c184dedbf2,caff9805-d4d1-49ea-a625-1c275cb0bc4d
    const element: React.ReactElement<IExcelGraphProps> = React.createElement(
      ExcelGraph,
      {
        httpGraph: this.graphClient,
        siteId: `${document.location.hostname},${this.context.pageContext.site.id.toString()},${this.context.pageContext.web.id.toString()}`,
        libraryId: '2d79a297-84b6-4c49-9d4c-006810036518',
        itRequestsId: '2c7f1cf7-b2c2-424e-a01a-033dfc119a90'
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('libraryId', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
