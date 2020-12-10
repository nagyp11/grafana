import React, { PureComponent } from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { Tooltip, Icon, Button } from '@grafana/ui';
import { SlideDown } from 'app/core/components/Animations/SlideDown';
import { StoreState, FolderInfo } from 'app/types';
import { DashboardAcl, PermissionLevel, NewDashboardAclItem } from 'app/types/acl';
import {
  getDashboardPermissions,
  addDashboardPermission,
  removeDashboardPermission,
  updateDashboardPermission,
} from '../../state/actions';
import PermissionList from 'app/core/components/PermissionList/PermissionList';
import AddPermission from 'app/core/components/PermissionList/AddPermission';
import PermissionsInfo from 'app/core/components/PermissionList/PermissionsInfo';

export interface OwnProps {
  dashboardId: number;
  folder?: FolderInfo;
}

export interface ConnectedProps {
  permissions: DashboardAcl[];
}

export interface DispatchProps {
  getDashboardPermissions: typeof getDashboardPermissions;
  updateDashboardPermission: typeof updateDashboardPermission;
  removeDashboardPermission: typeof removeDashboardPermission;
  addDashboardPermission: typeof addDashboardPermission;
}

export type Props = OwnProps & ConnectedProps & DispatchProps;

export interface State {
  isAdding: boolean;
}

export class DashboardPermissionsUnconnected extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isAdding: false,
    };
  }

  componentDidMount() {
    this.props.getDashboardPermissions(this.props.dashboardId);
  }

  onOpenAddPermissions = () => {
    this.setState({ isAdding: true });
  };

  onRemoveItem = (item: DashboardAcl) => {
    this.props.removeDashboardPermission(this.props.dashboardId, item);
  };

  onPermissionChanged = (item: DashboardAcl, level: PermissionLevel) => {
    this.props.updateDashboardPermission(this.props.dashboardId, item, level);
  };

  onAddPermission = (newItem: NewDashboardAclItem) => {
    return this.props.addDashboardPermission(this.props.dashboardId, newItem);
  };

  onCancelAddPermission = () => {
    this.setState({ isAdding: false });
  };

  render() {
    const { permissions, folder } = this.props;
    const { isAdding } = this.state;

    return (
      <div>
        <div className="dashboard-settings__header">
          <div className="page-action-bar">
            <h3 className="d-inline-block">Permissions</h3>
            <Tooltip placement="auto" content={<PermissionsInfo />}>
              <Icon className="icon--has-hover page-sub-heading-icon" name="question-circle" />
            </Tooltip>
            <div className="page-action-bar__spacer" />
            <Button className="pull-right" onClick={this.onOpenAddPermissions} disabled={isAdding}>
              Add Permission
            </Button>
          </div>
        </div>
        <SlideDown in={isAdding}>
          <AddPermission onAddPermission={this.onAddPermission} onCancel={this.onCancelAddPermission} />
        </SlideDown>
        <PermissionList
          items={permissions}
          onRemoveItem={this.onRemoveItem}
          onPermissionChanged={this.onPermissionChanged}
          isFetching={false}
          folderInfo={folder}
        />
      </div>
    );
  }
}

const mapStateToProps: MapStateToProps<ConnectedProps, OwnProps, StoreState> = state => ({
  permissions: state.dashboard.permissions,
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = {
  getDashboardPermissions,
  addDashboardPermission,
  removeDashboardPermission,
  updateDashboardPermission,
};

export const DashboardPermissions = connect(mapStateToProps, mapDispatchToProps)(DashboardPermissionsUnconnected);
