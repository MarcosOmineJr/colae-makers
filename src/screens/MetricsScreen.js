import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Dimensions,
    ScrollView,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import ColaeAPI from '../api';
import { CardSwiper } from 'native-base';

const { ColUI } = ColaeAPI;

const MetricsScreen = (props)=>{

    const [test, setTest] = useState(0);

    const { ColUITheme } = props;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.cardRow}>
                    <ColUI.Card colSpan = {3} contentContainerStyle={styles.card}>
                        <Text style={[styles.cardTitle, { color: ColUITheme.gray.light }]}>Visitas</Text>
                        <Text style={[styles.cardContent, { color: ColUITheme.main }]}>365</Text>
                    </ColUI.Card>
                    <ColUI.Card colSpan = {3} contentContainerStyle={styles.card}>
                        <Text style={[styles.cardTitle, { color: ColUITheme.gray.light }]}>Ingressos Vendidos</Text>
                        <Text style={[styles.cardContent, { color: ColUITheme.main }]}>844</Text>
                    </ColUI.Card>
                </View>
                <View style={styles.cardRow}>
                    <ColUI.Card colSpan = {3} contentContainerStyle={styles.card}>
                        <Text style={[styles.cardTitle, { color: ColUITheme.gray.light }]}>Produtos Vendidos</Text>
                        <Text style={[styles.cardContent, { color: ColUITheme.main }]}>759</Text>
                    </ColUI.Card>
                    <ColUI.Card colSpan = {3} contentContainerStyle={styles.card}>
                        <Text style={[styles.cardTitle, { color: ColUITheme.gray.light }]}>Total de Avaliações</Text>
                        <Text style={[styles.cardContent, { color: ColUITheme.main }]}>451</Text>
                    </ColUI.Card>
                </View>
            </View>

            {/* Colocar os Highcharts da vida */}

        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    cardContainer:{
        marginBottom: 40
    },
    cardRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    card:{
        padding: 10,
        borderRadius: 10
    },
    cardTitle:{
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10
    },
    cardContent:{
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 25
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});

export default connect(mapStateToProps)(MetricsScreen)