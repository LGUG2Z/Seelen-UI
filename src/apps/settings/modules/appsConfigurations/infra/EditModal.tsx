import { SettingsGroup, SettingsOption, SettingsSubGroup } from '../../../components/SettingsBox';
import { createSelector } from '@reduxjs/toolkit';
import { ConfigProvider, Input, Modal, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ownSelector, RootSelectors } from '../../shared/app/selectors';
import { OptionsFromEnum } from '../../shared/app/utils';

import { RootState } from '../../shared/domain/state';
import {
  AppConfiguration,
  AppConfigurationExtended,
  ApplicationIdentifier,
  ApplicationOptions,
  MatchingStrategy,
} from '../domain';

import cs from './index.module.css';

interface Props {
  idx?: number;
  open: boolean;
  onSave: (app: AppConfigurationExtended) => void;
  onCancel: () => void;
  isNew?: boolean;
  readonlyApp?: AppConfigurationExtended;
}

const getAppSelector = (idx: number | undefined, isNew: boolean) => createSelector([ownSelector], (state: RootState) => {
  return idx != null && !isNew ? state.appsConfigurations[idx]! : AppConfiguration.default();
});

export const EditAppModal = ({ idx, onCancel, onSave, isNew, open, readonlyApp }: Props) => {
  const monitors = useSelector(RootSelectors.monitors);
  const _app = useSelector(getAppSelector(idx, !!isNew));
  const initialState = readonlyApp || _app;
  const isReadonly = !!readonlyApp;

  const [app, setApp] = useState(initialState);

  useEffect(() => {
    if (isNew && !open) { // reset state on close
      setApp(initialState);
    }
  }, [open]);

  const onInternalSave = () => {
    onSave(app as AppConfigurationExtended);
  };

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => setApp({ ...app, name: e.target.value });
  const updateCategory = (e: React.ChangeEvent<HTMLInputElement>) =>
    setApp({ ...app, category: e.target.value || null });
  const updateIdentifier = (e: React.ChangeEvent<HTMLInputElement>) => setApp({ ...app, identifier: e.target.value });

  const onSelectKind = (value: ApplicationIdentifier) => setApp({ ...app, kind: value });
  const onSelectMatchingStrategy = (value: MatchingStrategy) => setApp({ ...app, matchingStrategy: value });

  const onSelectMonitor = (value: number | null) => setApp({ ...app, monitor: value });
  const onSelectWorkspace = (value: string | null) => setApp({ ...app, workspace: value });

  const onChangeOption = (option: ApplicationOptions, value: boolean) => setApp({ ...app, [option]: value });

  const monitorsOptions = monitors.map((_, i) => ({ label: `Monitor ${i + 1}`, value: i }));
  const workspaceOptions =
    app.monitor != null && monitors[app.monitor]
      ? monitors[app.monitor]?.workspaces.map(({ name }) => ({ label: name, value: name }))
      : [];

  let title = 'Editing';
  let okText = 'Update';
  if (isNew) {
    title = 'Creating';
    okText = 'Create';
  }
  if (isReadonly) {
    title = 'Viewing';
    okText = 'Edit as New App';
  }

  return (
    <Modal
      title={`${title} ${app.name}`}
      open={open}
      onCancel={onCancel}
      onOk={onInternalSave}
      okText={okText}
      cancelButtonProps={isReadonly ? { style: { display: 'none' } } : undefined}
      centered
      className={cs.editModal}
    >
      <ConfigProvider componentDisabled={isReadonly}>
        {
          !!readonlyApp && <SettingsGroup>
            <SettingsSubGroup label={`Loaded from ${readonlyApp.templateName} pack`}>
              <p>{readonlyApp.templateDescription}</p>
            </SettingsSubGroup>
          </SettingsGroup>
        }
        <SettingsGroup>
          <div>
            <SettingsOption>
              <span>Name</span>
              <Input value={app.name} onChange={updateName} required />
            </SettingsOption>
            <SettingsOption>
              <span>Category</span>
              <Input value={app.category || ''} placeholder="None" onChange={updateCategory} />
            </SettingsOption>
          </div>
          <SettingsSubGroup label="Application Identifier">
            <SettingsOption>
              <span>Identifier</span>
              <Input value={app.identifier} onChange={updateIdentifier} />
            </SettingsOption>
            <SettingsOption>
              <span>Identify By</span>
              <Select value={app.kind} options={OptionsFromEnum(ApplicationIdentifier)} onSelect={onSelectKind} />
            </SettingsOption>
            <SettingsOption>
              <span>Maching Strategy</span>
              <Select
                value={app.matchingStrategy}
                options={OptionsFromEnum(MatchingStrategy)}
                onSelect={onSelectMatchingStrategy}
              />
            </SettingsOption>
          </SettingsSubGroup>
        </SettingsGroup>

        <SettingsGroup>
          <SettingsSubGroup label="Binding *note: both options are required">
            <SettingsOption>
              <span>Monitor</span>
              <Select
                value={app.monitor}
                placeholder="None"
                allowClear
                options={monitorsOptions}
                onChange={onSelectMonitor}
              />
            </SettingsOption>
            <SettingsOption>
              <span>Workspace</span>
              <Select
                value={app.workspace}
                placeholder="None"
                allowClear
                options={workspaceOptions}
                onChange={onSelectWorkspace}
              />
            </SettingsOption>
          </SettingsSubGroup>
        </SettingsGroup>

        <SettingsGroup>
          <SettingsSubGroup label="Extra Options">
            {Object.values(ApplicationOptions).map((value, i) => (
              <SettingsOption key={i}>
                <span>{value}</span>
                <Switch value={app[value]} onChange={onChangeOption.bind(this, value)} />
              </SettingsOption>
            ))}
          </SettingsSubGroup>
        </SettingsGroup>
      </ConfigProvider>
    </Modal>
  );
};
