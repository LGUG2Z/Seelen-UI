import { SettingsGroup, SettingsOption, SettingsSubGroup } from '../../components/SettingsBox';
import { InputNumber, Select, Switch } from 'antd';

import { useAppDispatch, useAppSelector } from '../shared/app/hooks';
import { RootSelectors } from '../shared/app/selectors';
import { OptionsFromEnum } from '../shared/app/utils';
import { SeelenWegActions } from './app';

import { SeelenWegMode, SeelenWegSide } from './domain';

export const SeelenWegSettings = () => {
  const settings = useAppSelector(RootSelectors.seelenweg);

  const dispatch = useAppDispatch();

  const onToggleEnable = (value: boolean) => {
    dispatch(SeelenWegActions.setEnabled(value));
  };

  return (
    <>
      <SettingsGroup>
        <SettingsOption>
          <div>
            <b>Enable SeelenWeg</b>
          </div>
          <Switch checked={settings.enabled} onChange={onToggleEnable} />
        </SettingsOption>
      </SettingsGroup>

      <SettingsGroup>
        <SettingsSubGroup label="Dock/Taskbar">
          <SettingsOption>
            <div>Width</div>
            <Select
              style={{ width: '120px' }}
              value={settings.mode}
              options={OptionsFromEnum(SeelenWegMode)}
              onChange={(value) => dispatch(SeelenWegActions.setMode(value))}
            />
          </SettingsOption>
          <SettingsOption>
            <div>Side to show dock</div>
            <Select
              style={{ width: '120px' }}
              value={settings.position}
              options={OptionsFromEnum(SeelenWegSide)}
              onChange={(value) => dispatch(SeelenWegActions.setPosition(value))}
            />
          </SettingsOption>
          <SettingsOption>
            <div>Margin</div>
            <InputNumber
              value={settings.margin}
              onChange={(value) => dispatch(SeelenWegActions.setMargin(value || 0))}
            />
          </SettingsOption>
          <SettingsOption>
            <div>Padding</div>
            <InputNumber
              value={settings.padding}
              onChange={(value) => dispatch(SeelenWegActions.setPadding(value || 0))}
            />
          </SettingsOption>
        </SettingsSubGroup>
      </SettingsGroup>

      <SettingsGroup>
        <SettingsSubGroup label="Items">
          <SettingsOption>
            <div>Size</div>
            <InputNumber
              value={settings.size}
              onChange={(value) => dispatch(SeelenWegActions.setSize(value || 0))}
            />
          </SettingsOption>
          <SettingsOption>
            <div>Size on hover</div>
            <InputNumber
              value={settings.zoomSize}
              onChange={(value) => dispatch(SeelenWegActions.setZoomSize(value || 0))}
            />
          </SettingsOption>
          <SettingsOption>
            <div>Space between items</div>
            <InputNumber
              value={settings.spaceBetweenItems}
              onChange={(value) => dispatch(SeelenWegActions.setSpaceBetweenItems(value || 0))}
            />
          </SettingsOption>
        </SettingsSubGroup>
      </SettingsGroup>
    </>
  );
};
