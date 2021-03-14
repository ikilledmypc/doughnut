package com.odde.doughnut.models.randomizers;

import com.odde.doughnut.models.Randomizer;

import java.util.List;

public class NonRandomizer implements Randomizer {
    @Override
    public String chooseOneRandomly(List<String> list) {
        return list.get(0);
    }
}
