import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TypeFactory } from '@syndesis/ui/model';
import { IntegrationService } from './integration.service';

import { createIntegration, createStep, Integration, Integrations } from '@syndesis/ui/platform';

import { AbstractStore } from '../entity/entity.store';
import { EventsService } from '../entity/events.service';
import { Response } from '@angular/http';

@Injectable()
export class IntegrationStore extends AbstractStore<
  Integration,
  Integrations,
  IntegrationService
> {
  constructor(
    integrationService: IntegrationService,
    eventService: EventsService
  ) {
    super(integrationService, eventService, [], <Integration>{});
  }

  protected get kind() {
    return 'Integration';
  }

  public activate(integration: Integration): Observable<Integration> {
    return this.update(integration).map(result => {
      this.service.deploy(result);
      return result;
     });
  }

  public deactivate(integration: Integration): Observable<Response> {
    return this.service.undeploy(integration);
  }

  newInstance(): Integration {
    const integration = createIntegration();
    const start = createStep();
    const end = createStep();
    start.stepKind = end.stepKind = 'endpoint';
    integration.steps = [start, end];
    return integration;
  }
}
