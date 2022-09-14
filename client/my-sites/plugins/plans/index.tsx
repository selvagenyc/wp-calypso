import { getUrlParts } from '@automattic/calypso-url';
import { useTranslate } from 'i18n-calypso';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DocumentHead from 'calypso/components/data/document-head';
import FixedNavigationHeader from 'calypso/components/fixed-navigation-header';
import FormattedHeader from 'calypso/components/formatted-header';
import MainComponent from 'calypso/components/main';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import PlansFeaturesMain from 'calypso/my-sites/plans-features-main';
import { appendBreadcrumb } from 'calypso/state/breadcrumb/actions';
import { getBreadcrumbs } from 'calypso/state/breadcrumb/selectors';
import { getSelectedSite } from 'calypso/state/ui/selectors';

import './style.scss';

const Plans = () => {
	const translate = useTranslate();
	const breadcrumbs = useSelector( getBreadcrumbs );
	const selectedSite = useSelector( getSelectedSite );
	const dispatch = useDispatch();
	useEffect( () => {
		if ( breadcrumbs.length === 0 ) {
			dispatch(
				appendBreadcrumb( {
					label: translate( 'Plugins' ),
					href: `/plugins/${ selectedSite?.slug || '' }`,
					id: 'plugins',
					helpBubble: translate(
						'Add new functionality and integrations to your site with plugins.'
					),
				} )
			);
		}

		dispatch(
			appendBreadcrumb( {
				label: translate( 'Plan Upgrade' ),
				href: `/plugins/plans/${ selectedSite?.slug || '' }`,
				id: `plugin-plans`,
			} )
		);
	}, [ dispatch, translate, selectedSite, breadcrumbs.length ] );

	const getIntervalType = () => {
		const urlParts = getUrlParts( typeof window !== 'undefined' ? window.location?.href : '' );
		const intervalType = urlParts?.searchParams.get( 'intervalType' ) || '';

		if ( [ 'yearly', 'monthly' ].includes( intervalType ) ) {
			return intervalType;
		}

		// Default value
		return 'yearly';
	};

	return (
		<MainComponent wideLayout>
			<PageViewTracker path="/plugins/plans/:site" title="Plugins > Plan Upgrade" />
			<DocumentHead title={ translate( 'Plugins > Plan Upgrade' ) } />
			<FixedNavigationHeader navigationItems={ breadcrumbs } />
			<FormattedHeader
				className="plugin-plans-header"
				headerText={ `Your current plan doesn't support plugins` }
				subHeaderText={ `Choose the plan that's right for you and reimagine what's possible with plugins` }
				brandFont
			/>
			<div className="plans">
				<PlansFeaturesMain
					site={ selectedSite || {} } // `PlanFeaturesMain` expects a default prop of `{}` if no site is provided
					// hideFreePlan={ hideFreePlan }
					isInSignup
					isInMarketplace
					// isLaunchPage={ isLaunchPage }
					intervalType={ getIntervalType() }
					// onUpgradeClick={ this.onSelectPlan }
					// domainName={ this.getDomainName() }
					// customerType={ this.getCustomerType() }
					// disableBloggerPlanWithNonBlogDomain={ disableBloggerPlanWithNonBlogDomain }
					// plansWithScroll={ isDesktop() }
					// planTypes={ planTypes }
					// flowName={ flowName }
					shouldShowPlansFeatureComparison // Show feature comparison layout in signup flow and desktop resolutions
					isReskinned
					// isCondensedFeaturesExperiment={ experimentAssignment?.variationName === 'treatment' }
				/>
			</div>
		</MainComponent>
	);
};

export default Plans;
